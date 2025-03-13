import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertTournamentParticipantSchema, insertGameSchema } from "@shared/schema";

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Get all games
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  // Get a specific game
  app.get("/api/games/:id", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const game = await storage.getGame(gameId);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });
  
  // Create a new game
  app.post("/api/games", async (req, res) => {
    try {
      // Validate with Zod
      const gameData = insertGameSchema.parse(req.body);
      const newGame = await storage.createGame(gameData);
      res.status(201).json(newGame);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      console.error("Game creation error:", error);
      res.status(500).json({ message: "Failed to create game" });
    }
  });

  // Get all tournaments
  app.get("/api/tournaments", async (req, res) => {
    try {
      const gameId = req.query.gameId ? parseInt(req.query.gameId as string) : undefined;
      
      let tournaments;
      if (gameId) {
        tournaments = await storage.getTournamentsByGame(gameId);
      } else {
        tournaments = await storage.getTournaments();
      }
      
      res.json(tournaments);
    } catch (error) {
      console.error("Tournament fetch error:", error);
      res.status(500).json({ message: "Failed to fetch tournaments", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Get a specific tournament
  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const tournamentId = parseInt(req.params.id);
      const tournament = await storage.getTournament(tournamentId);
      
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      // Get the game for this tournament
      const game = await storage.getGame(tournament.gameId);
      
      // Get participants count
      const participants = await storage.getParticipantsForTournament(tournamentId);
      
      res.json({
        ...tournament,
        game,
        participantsCount: participants.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });

  // Create payment intent for tournament registration
  app.post("/api/tournaments/:id/payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to register for tournaments" });
    }

    try {
      const tournamentId = parseInt(req.params.id);
      const userId = req.user!.id;

      // Check if tournament exists
      const tournament = await storage.getTournament(tournamentId);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }

      // Check if user is already registered
      const isRegistered = await storage.isUserRegisteredForTournament(userId, tournamentId);
      if (isRegistered) {
        return res.status(400).json({ message: "You are already registered for this tournament" });
      }

      // Check if tournament is full
      const participants = await storage.getParticipantsForTournament(tournamentId);
      if (tournament.playerLimit && participants.length >= tournament.playerLimit) {
        return res.status(400).json({ message: "Tournament is full" });
      }

      // Create a payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: tournament.entryFee ? Math.round(tournament.entryFee * 100) : 1000, // Convert to cents, default to $10 if not set
        currency: 'usd',
        metadata: {
          tournamentId: tournament.id.toString(),
          userId: userId.toString()
        }
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        tournament
      });
    } catch (error) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  // Register for a tournament (after successful payment)
  app.post("/api/tournaments/:id/register", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to register for tournaments" });
    }
    
    try {
      const tournamentId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      // Check if tournament exists
      const tournament = await storage.getTournament(tournamentId);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      // Check if user is already registered
      const isRegistered = await storage.isUserRegisteredForTournament(userId, tournamentId);
      if (isRegistered) {
        return res.status(400).json({ message: "You are already registered for this tournament" });
      }
      
      // Check if tournament is full
      const participants = await storage.getParticipantsForTournament(tournamentId);
      if (tournament.playerLimit && participants.length >= tournament.playerLimit) {
        return res.status(400).json({ message: "Tournament is full" });
      }

      // Verify payment intent if payment is required
      if (tournament.entryFee) {
        const { paymentIntentId } = req.body;
        if (!paymentIntentId) {
          return res.status(400).json({ message: "Payment is required for this tournament" });
        }

        // Retrieve payment intent to verify payment
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (
          paymentIntent.status !== 'succeeded' ||
          paymentIntent.metadata.tournamentId !== tournamentId.toString() ||
          paymentIntent.metadata.userId !== userId.toString()
        ) {
          return res.status(400).json({ message: "Invalid or incomplete payment" });
        }
      }
      
      // Register the user
      const data = {
        tournamentId,
        userId
      };
      
      // Validate with Zod
      const validatedData = insertTournamentParticipantSchema.parse(data);
      
      const registration = await storage.registerForTournament(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register for tournament" });
    }
  });

  // Get matches for a user
  app.get("/api/matches", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view matches" });
    }
    
    try {
      const userId = req.user!.id;
      const matches = await storage.getMatchesForUser(userId);
      
      // Get tournament details for each match
      const matchesWithDetails = await Promise.all(matches.map(async (match) => {
        const tournament = await storage.getTournament(match.tournamentId);
        return {
          ...match,
          tournament
        };
      }));
      
      res.json(matchesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      
      // Get user details for each leaderboard entry
      const leaderboardWithUsers = await Promise.all(leaderboard.map(async (entry) => {
        const user = await storage.getUser(entry.userId);
        if (!user) return null;
        
        // Remove sensitive user data
        const { password, ...userWithoutPassword } = user;
        
        return {
          ...entry,
          user: userWithoutPassword
        };
      }));
      
      // Filter out any null entries (where user wasn't found)
      const validEntries = leaderboardWithUsers.filter(entry => entry !== null);
      
      res.json(validEntries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Get user's leaderboard entry
  app.get("/api/users/:id/leaderboard", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const leaderboardEntry = await storage.getUserLeaderboard(userId);
      
      if (!leaderboardEntry) {
        return res.status(404).json({ message: "Leaderboard entry not found" });
      }
      
      res.json(leaderboardEntry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard entry" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
