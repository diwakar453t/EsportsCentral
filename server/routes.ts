import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertGameSchema, 
  insertTournamentSchema, 
  insertUserProfileSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Profile routes
  app.get("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const profile = await storage.getUserProfile(req.user.id);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const updateSchema = insertUserProfileSchema.partial().omit({ userId: true });
      const data = updateSchema.parse(req.body);
      
      const updatedProfile = await storage.updateUserProfile(req.user.id, data);
      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Tournament routes
  app.get("/api/tournaments", async (req, res) => {
    try {
      const tournaments = await storage.getTournaments();
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  app.get("/api/tournaments/live", async (req, res) => {
    try {
      const tournaments = await storage.getLiveTournaments();
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live tournaments" });
    }
  });

  app.get("/api/tournaments/user", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const tournaments = await storage.getUserTournaments(req.user.id);
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user tournaments" });
    }
  });

  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tournament ID" });
      }
      
      const tournament = await storage.getTournament(id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });

  app.post("/api/tournaments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const tournamentData = insertTournamentSchema.parse({
        ...req.body,
        createdBy: req.user.id
      });
      
      const tournament = await storage.createTournament(tournamentData);
      res.status(201).json(tournament);
    } catch (error) {
      res.status(500).json({ message: "Failed to create tournament" });
    }
  });

  app.post("/api/tournaments/:id/join", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const tournamentId = parseInt(req.params.id);
      if (isNaN(tournamentId)) {
        return res.status(400).json({ message: "Invalid tournament ID" });
      }
      
      const result = await storage.joinTournament(tournamentId, req.user.id);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to join tournament" });
    }
  });

  // Game routes
  app.get("/api/games", async (req, res) => {
    try {
      const genre = req.query.genre as string;
      const sort = req.query.sort as string;
      
      const games = await storage.getGames(genre, sort);
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.get("/api/games/list", async (req, res) => {
    try {
      const games = await storage.getGamesList();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games list" });
    }
  });

  app.get("/api/games/genres", async (req, res) => {
    try {
      const genres = await storage.getGameGenres();
      res.json(genres);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game genres" });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }
      
      const game = await storage.getGame(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  app.post("/api/games", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    try {
      const gameData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(gameData);
      res.status(201).json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to create game" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const game = req.query.game as string;
      const region = req.query.region as string;
      
      const leaderboard = await storage.getLeaderboard(game, region);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/leaderboard/top", async (req, res) => {
    try {
      const leaderboard = await storage.getTopPlayers();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top players" });
    }
  });

  // Mock countries data for dropdown
  app.get("/api/countries", (req, res) => {
    const countries = [
      { code: "US", name: "United States" },
      { code: "GB", name: "United Kingdom" },
      { code: "CA", name: "Canada" },
      { code: "AU", name: "Australia" },
      { code: "DE", name: "Germany" },
      { code: "FR", name: "France" },
      { code: "JP", name: "Japan" },
      { code: "BR", name: "Brazil" },
      { code: "RU", name: "Russia" },
      { code: "CN", name: "China" },
      { code: "IN", name: "India" },
      { code: "KR", name: "South Korea" },
    ];
    res.json(countries);
  });

  // Mock regions data for dropdown
  app.get("/api/regions", (req, res) => {
    const regions = [
      { id: "global", name: "Global" },
      { id: "na", name: "North America" },
      { id: "eu", name: "Europe" },
      { id: "asia", name: "Asia" },
      { id: "oce", name: "Oceania" },
      { id: "sa", name: "South America" },
    ];
    res.json(regions);
  });

  const httpServer = createServer(app);
  return httpServer;
}
