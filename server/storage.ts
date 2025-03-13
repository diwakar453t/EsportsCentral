import { users, games, tournaments, tournamentParticipants, matches, leaderboard, type User, type InsertUser, type Game, type InsertGame, type Tournament, type InsertTournament, type TournamentParticipant, type InsertTournamentParticipant, type Match, type InsertMatch, type Leaderboard, type InsertLeaderboard } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";
import { db } from "./db";
import { eq, and, desc, asc, or } from "drizzle-orm";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User>;

  // Game operations
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;

  // Tournament operations
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  getTournamentsByGame(gameId: number): Promise<Tournament[]>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;

  // Tournament participant operations
  registerForTournament(data: InsertTournamentParticipant): Promise<TournamentParticipant>;
  getParticipantsForTournament(tournamentId: number): Promise<TournamentParticipant[]>;
  isUserRegisteredForTournament(userId: number, tournamentId: number): Promise<boolean>;

  // Match operations
  getMatches(): Promise<Match[]>;
  getMatchesForTournament(tournamentId: number): Promise<Match[]>;
  getMatchesForUser(userId: number): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatchResult(matchId: number, winnerId: number, score: string): Promise<Match>;

  // Leaderboard operations
  getLeaderboard(): Promise<Leaderboard[]>;
  getUserLeaderboard(userId: number): Promise<Leaderboard | undefined>;
  updateLeaderboard(userId: number, data: Partial<InsertLeaderboard>): Promise<Leaderboard>;

  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
    
    // Initialize with sample data only if tables are empty
    this.initializeData();
  }
  
  private async initializeData() {
    try {
      // Check if games table is empty
      const existingGames = await db.select().from(games);
      
      if (existingGames.length === 0) {
        await this.initializeGames();
        await this.initializeTournaments();
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }
  
  private async initializeGames() {
    const sampleGames = [
      {
        name: "Valorant",
        image: "https://images.unsplash.com/photo-1579139273771-e3a458d80f56",
        activePlayers: 12854,
        tournamentCount: 24
      },
      {
        name: "CS:GO",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
        activePlayers: 18352,
        tournamentCount: 32
      },
      {
        name: "Fortnite",
        image: "https://images.unsplash.com/photo-1583833008338-31a470dd984d",
        activePlayers: 15987,
        tournamentCount: 18
      },
      {
        name: "League of Legends",
        image: "https://images.unsplash.com/photo-1619962305107-96a06628c7e1",
        activePlayers: 22634,
        tournamentCount: 28
      }
    ];
    
    for (const game of sampleGames) {
      await db.insert(games).values(game);
    }
  }
  
  private async initializeTournaments() {
    const now = new Date();
    const allGames = await db.select().from(games);
    
    const tournamentData = [
      {
        name: "CS:GO Champions League",
        gameId: allGames.find(g => g.name === "CS:GO")?.id || 1,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
        description: "The premier CS:GO tournament for elite teams.",
        prizePool: 25000,
        teamSize: 5,
        playerLimit: 128,
        startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: "upcoming"
      },
      {
        name: "Valorant Uprising",
        gameId: allGames.find(g => g.name === "Valorant")?.id || 2,
        image: "https://images.unsplash.com/photo-1579139273771-e3a458d80f56",
        description: "Battle against the best Valorant teams for glory.",
        prizePool: 15000,
        teamSize: 5,
        playerLimit: 64,
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: "upcoming"
      },
      {
        name: "Fortnite Masters",
        gameId: allGames.find(g => g.name === "Fortnite")?.id || 3,
        image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff",
        description: "The ultimate battle royale competition.",
        prizePool: 10000,
        teamSize: 1,
        playerLimit: 100,
        startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: "upcoming"
      }
    ];
    
    for (const tournament of tournamentData) {
      await db.insert(tournaments).values(tournament);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    
    // Create a leaderboard entry for the new user
    await db.insert(leaderboard).values({
      userId: user.id,
      points: 0,
      wins: 0,
      losses: 0,
      rank: 0, // Will be updated later
    });
    
    // Update all ranks in the leaderboard
    await this.recalculateLeaderboardRanks();
    
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    
    return updatedUser;
  }

  // Game operations
  async getGames(): Promise<Game[]> {
    return db.select().from(games);
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db
      .select()
      .from(games)
      .where(eq(games.id, id));
    return game;
  }

  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db
      .insert(games)
      .values(game)
      .returning();
    return newGame;
  }

  // Tournament operations
  async getTournaments(): Promise<Tournament[]> {
    return db.select().from(tournaments);
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, id));
    return tournament;
  }

  async getTournamentsByGame(gameId: number): Promise<Tournament[]> {
    return db
      .select()
      .from(tournaments)
      .where(eq(tournaments.gameId, gameId));
  }

  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const [newTournament] = await db
      .insert(tournaments)
      .values(tournament)
      .returning();
    return newTournament;
  }

  // Tournament participant operations
  async registerForTournament(data: InsertTournamentParticipant): Promise<TournamentParticipant> {
    const [participant] = await db
      .insert(tournamentParticipants)
      .values(data)
      .returning();
    return participant;
  }

  async getParticipantsForTournament(tournamentId: number): Promise<TournamentParticipant[]> {
    return db
      .select()
      .from(tournamentParticipants)
      .where(eq(tournamentParticipants.tournamentId, tournamentId));
  }

  async isUserRegisteredForTournament(userId: number, tournamentId: number): Promise<boolean> {
    const [participant] = await db
      .select()
      .from(tournamentParticipants)
      .where(and(
        eq(tournamentParticipants.userId, userId),
        eq(tournamentParticipants.tournamentId, tournamentId)
      ));
    return !!participant;
  }

  // Match operations
  async getMatches(): Promise<Match[]> {
    return db.select().from(matches);
  }

  async getMatchesForTournament(tournamentId: number): Promise<Match[]> {
    return db
      .select()
      .from(matches)
      .where(eq(matches.tournamentId, tournamentId));
  }

  async getMatchesForUser(userId: number): Promise<Match[]> {
    return db
      .select()
      .from(matches)
      .where(
        or(
          eq(matches.player1Id, userId),
          eq(matches.player2Id, userId)
        )
      );
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db
      .insert(matches)
      .values(match)
      .returning();
    return newMatch;
  }

  async updateMatchResult(matchId: number, winnerId: number, score: string): Promise<Match> {
    const [match] = await db
      .update(matches)
      .set({ winnerId, score })
      .where(eq(matches.id, matchId))
      .returning();
    
    if (!match) {
      throw new Error(`Match with id ${matchId} not found`);
    }
    
    // Update leaderboard for winner
    const [winner] = await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.userId, winnerId));
    
    if (winner) {
      const newPoints = (winner.points || 0) + 100;
      const newWins = (winner.wins || 0) + 1;
      
      await db
        .update(leaderboard)
        .set({
          points: newPoints,
          wins: newWins
        })
        .where(eq(leaderboard.userId, winnerId));
    }
    
    // Update leaderboard for loser
    const loserId = match.player1Id === winnerId ? match.player2Id : match.player1Id;
    const [loser] = await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.userId, loserId));
    
    if (loser) {
      const newLosses = (loser.losses || 0) + 1;
      
      await db
        .update(leaderboard)
        .set({ losses: newLosses })
        .where(eq(leaderboard.userId, loserId));
    }
    
    // Recalculate ranks
    await this.recalculateLeaderboardRanks();
    
    return match;
  }

  // Leaderboard operations
  async getLeaderboard(): Promise<Leaderboard[]> {
    const entries = await db.select().from(leaderboard);
    
    // Sort entries by points (handle null values)
    return entries.sort((a, b) => {
      const pointsA = a.points || 0;
      const pointsB = b.points || 0;
      return pointsB - pointsA;
    });
  }

  async getUserLeaderboard(userId: number): Promise<Leaderboard | undefined> {
    const [entry] = await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.userId, userId));
    return entry;
  }

  async updateLeaderboard(userId: number, data: Partial<InsertLeaderboard>): Promise<Leaderboard> {
    const [updatedEntry] = await db
      .update(leaderboard)
      .set(data)
      .where(eq(leaderboard.userId, userId))
      .returning();
    
    if (!updatedEntry) {
      throw new Error(`Leaderboard entry for user ${userId} not found`);
    }
    
    // Recalculate ranks
    await this.recalculateLeaderboardRanks();
    
    return updatedEntry;
  }
  
  private async recalculateLeaderboardRanks(): Promise<void> {
    // Get all leaderboard entries sorted by points
    const entries = await db
      .select()
      .from(leaderboard);
    
    // Sort entries by points (handle null values)
    const sortedEntries = entries.sort((a, b) => {
      const pointsA = a.points || 0;
      const pointsB = b.points || 0;
      return pointsB - pointsA;
    });
    
    // Update ranks for each entry
    for (let i = 0; i < sortedEntries.length; i++) {
      await db
        .update(leaderboard)
        .set({ rank: i + 1 })
        .where(eq(leaderboard.id, sortedEntries[i].id));
    }
  }
}

// Initialize the correct storage implementation
export const storage = new DatabaseStorage();
