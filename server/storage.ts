import { users, games, tournaments, tournamentParticipants, matches, leaderboard, type User, type InsertUser, type Game, type InsertGame, type Tournament, type InsertTournament, type TournamentParticipant, type InsertTournamentParticipant, type Match, type InsertMatch, type Leaderboard, type InsertLeaderboard } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersStore: Map<number, User>;
  private gamesStore: Map<number, Game>;
  private tournamentsStore: Map<number, Tournament>;
  private tournamentParticipantsStore: Map<number, TournamentParticipant>;
  private matchesStore: Map<number, Match>;
  private leaderboardStore: Map<number, Leaderboard>;
  
  sessionStore: session.SessionStore;
  private nextId: { [key: string]: number } = {};

  constructor() {
    this.usersStore = new Map();
    this.gamesStore = new Map();
    this.tournamentsStore = new Map();
    this.tournamentParticipantsStore = new Map();
    this.matchesStore = new Map();
    this.leaderboardStore = new Map();
    
    this.nextId = {
      users: 1,
      games: 1,
      tournaments: 1,
      tournamentParticipants: 1,
      matches: 1,
      leaderboard: 1
    };
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with some sample games
    this.initializeGames();
    this.initializeTournaments();
  }
  
  private initializeGames() {
    const sampleGames = [
      {
        id: this.getNextId('games'),
        name: "Valorant",
        image: "https://images.unsplash.com/photo-1579139273771-e3a458d80f56",
        activePlayers: 12854,
        tournamentCount: 24
      },
      {
        id: this.getNextId('games'),
        name: "CS:GO",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
        activePlayers: 18352,
        tournamentCount: 32
      },
      {
        id: this.getNextId('games'),
        name: "Fortnite",
        image: "https://images.unsplash.com/photo-1583833008338-31a470dd984d",
        activePlayers: 15987,
        tournamentCount: 18
      },
      {
        id: this.getNextId('games'),
        name: "League of Legends",
        image: "https://images.unsplash.com/photo-1619962305107-96a06628c7e1",
        activePlayers: 22634,
        tournamentCount: 28
      }
    ];
    
    sampleGames.forEach(game => {
      this.gamesStore.set(game.id, game);
    });
  }
  
  private initializeTournaments() {
    const now = new Date();
    
    const tournaments = [
      {
        id: this.getNextId('tournaments'),
        name: "CS:GO Champions League",
        gameId: 2, // CS:GO
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
        description: "The premier CS:GO tournament for elite teams.",
        prizePool: 25000,
        teamSize: 5,
        playerLimit: 128,
        startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: "upcoming"
      },
      {
        id: this.getNextId('tournaments'),
        name: "Valorant Uprising",
        gameId: 1, // Valorant
        image: "https://images.unsplash.com/photo-1579139273771-e3a458d80f56",
        description: "Battle against the best Valorant teams for glory.",
        prizePool: 15000,
        teamSize: 5,
        playerLimit: 64,
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: "upcoming"
      },
      {
        id: this.getNextId('tournaments'),
        name: "Fortnite Masters",
        gameId: 3, // Fortnite
        image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff",
        description: "The ultimate battle royale competition.",
        prizePool: 10000,
        teamSize: 1,
        playerLimit: 100,
        startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: "upcoming"
      }
    ];
    
    tournaments.forEach(tournament => {
      this.tournamentsStore.set(tournament.id, tournament);
    });
  }

  private getNextId(entity: string): number {
    const id = this.nextId[entity]++;
    return id;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersStore.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersStore.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.getNextId('users');
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.usersStore.set(id, user);
    
    // Also create a leaderboard entry for this user
    const leaderboardEntry: Leaderboard = {
      id: this.getNextId('leaderboard'),
      userId: id,
      points: 0,
      wins: 0,
      losses: 0,
      rank: this.leaderboardStore.size + 1
    };
    this.leaderboardStore.set(leaderboardEntry.id, leaderboardEntry);
    
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = { ...user, ...userData };
    this.usersStore.set(id, updatedUser);
    return updatedUser;
  }

  // Game operations
  async getGames(): Promise<Game[]> {
    return Array.from(this.gamesStore.values());
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.gamesStore.get(id);
  }

  async createGame(game: InsertGame): Promise<Game> {
    const id = this.getNextId('games');
    const newGame: Game = { ...game, id };
    this.gamesStore.set(id, newGame);
    return newGame;
  }

  // Tournament operations
  async getTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournamentsStore.values());
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    return this.tournamentsStore.get(id);
  }

  async getTournamentsByGame(gameId: number): Promise<Tournament[]> {
    return Array.from(this.tournamentsStore.values()).filter(
      tournament => tournament.gameId === gameId
    );
  }

  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const id = this.getNextId('tournaments');
    const newTournament: Tournament = { ...tournament, id };
    this.tournamentsStore.set(id, newTournament);
    return newTournament;
  }

  // Tournament participant operations
  async registerForTournament(data: InsertTournamentParticipant): Promise<TournamentParticipant> {
    const id = this.getNextId('tournamentParticipants');
    const now = new Date();
    const participant: TournamentParticipant = { ...data, id, registeredAt: now };
    this.tournamentParticipantsStore.set(id, participant);
    return participant;
  }

  async getParticipantsForTournament(tournamentId: number): Promise<TournamentParticipant[]> {
    return Array.from(this.tournamentParticipantsStore.values()).filter(
      participant => participant.tournamentId === tournamentId
    );
  }

  async isUserRegisteredForTournament(userId: number, tournamentId: number): Promise<boolean> {
    return Array.from(this.tournamentParticipantsStore.values()).some(
      participant => participant.userId === userId && participant.tournamentId === tournamentId
    );
  }

  // Match operations
  async getMatches(): Promise<Match[]> {
    return Array.from(this.matchesStore.values());
  }

  async getMatchesForTournament(tournamentId: number): Promise<Match[]> {
    return Array.from(this.matchesStore.values()).filter(
      match => match.tournamentId === tournamentId
    );
  }

  async getMatchesForUser(userId: number): Promise<Match[]> {
    return Array.from(this.matchesStore.values()).filter(
      match => match.player1Id === userId || match.player2Id === userId
    );
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.getNextId('matches');
    const newMatch: Match = { ...match, id };
    this.matchesStore.set(id, newMatch);
    return newMatch;
  }

  async updateMatchResult(matchId: number, winnerId: number, score: string): Promise<Match> {
    const match = this.matchesStore.get(matchId);
    if (!match) {
      throw new Error(`Match with id ${matchId} not found`);
    }
    
    const updatedMatch = { ...match, winnerId, score };
    this.matchesStore.set(matchId, updatedMatch);
    
    // Update leaderboard
    const winner = await this.getUserLeaderboard(winnerId);
    const loserId = match.player1Id === winnerId ? match.player2Id : match.player1Id;
    const loser = await this.getUserLeaderboard(loserId);
    
    if (winner) {
      await this.updateLeaderboard(winnerId, {
        points: winner.points + 100,
        wins: winner.wins + 1
      });
    }
    
    if (loser) {
      await this.updateLeaderboard(loserId, {
        losses: loser.losses + 1
      });
    }
    
    return updatedMatch;
  }

  // Leaderboard operations
  async getLeaderboard(): Promise<Leaderboard[]> {
    return Array.from(this.leaderboardStore.values())
      .sort((a, b) => b.points - a.points);
  }

  async getUserLeaderboard(userId: number): Promise<Leaderboard | undefined> {
    return Array.from(this.leaderboardStore.values()).find(
      entry => entry.userId === userId
    );
  }

  async updateLeaderboard(userId: number, data: Partial<InsertLeaderboard>): Promise<Leaderboard> {
    const entry = await this.getUserLeaderboard(userId);
    if (!entry) {
      throw new Error(`Leaderboard entry for user ${userId} not found`);
    }
    
    const updatedEntry = { ...entry, ...data };
    this.leaderboardStore.set(entry.id, updatedEntry);
    
    // Re-calculate ranks
    const sortedEntries = Array.from(this.leaderboardStore.values())
      .sort((a, b) => b.points - a.points);
    
    sortedEntries.forEach((entry, index) => {
      entry.rank = index + 1;
      this.leaderboardStore.set(entry.id, entry);
    });
    
    return updatedEntry;
  }
}

export const storage = new MemStorage();
