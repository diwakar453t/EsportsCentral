import { 
  InsertUser, 
  InsertGame, 
  InsertTournament, 
  InsertUserProfile,
  User, 
  Game, 
  Tournament, 
  UserProfile, 
  TournamentParticipant,
  Match 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Define the storage interface
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLoginTime(userId: number): Promise<void>;

  // User profiles
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: number, profile: Partial<InsertUserProfile>): Promise<UserProfile>;

  // Tournament management
  getTournaments(): Promise<Tournament[]>;
  getLiveTournaments(): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  getUserTournaments(userId: number): Promise<Tournament[]>;
  joinTournament(tournamentId: number, userId: number): Promise<TournamentParticipant>;

  // Game management
  getGames(genre?: string, sort?: string): Promise<Game[]>;
  getGamesList(): Promise<{ id: string, name: string }[]>;
  getGameGenres(): Promise<{ id: string, name: string }[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;

  // Leaderboard
  getLeaderboard(game?: string, region?: string): Promise<any[]>;
  getTopPlayers(): Promise<any[]>;

  // Session storage
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProfiles: Map<number, UserProfile>;
  private tournaments: Map<number, Tournament>;
  private tournamentParticipants: Map<number, TournamentParticipant[]>;
  private games: Map<number, Game>;
  private matches: Map<number, Match[]>;
  
  sessionStore: session.SessionStore;
  
  currentUserId: number;
  currentTournamentId: number;
  currentGameId: number;
  currentParticipantId: number;
  currentMatchId: number;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.tournaments = new Map();
    this.tournamentParticipants = new Map();
    this.games = new Map();
    this.matches = new Map();
    
    this.currentUserId = 1;
    this.currentTournamentId = 1;
    this.currentGameId = 1;
    this.currentParticipantId = 1;
    this.currentMatchId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24h
    });
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample games
    const sampleGames: InsertGame[] = [
      {
        name: "Valorant",
        description: "Tactical 5v5 shooter",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        icon: "https://via.placeholder.com/40/FF4655/FFFFFF?text=VAL",
        genre: "fps",
      },
      {
        name: "Fortnite",
        description: "Battle Royale",
        image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        icon: "https://via.placeholder.com/40/9D4DFF/FFFFFF?text=FN",
        genre: "battle-royale",
      },
      {
        name: "CS:GO",
        description: "Tactical team shooter",
        image: "https://images.unsplash.com/photo-1511882150382-421056c89033?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        icon: "https://via.placeholder.com/40/F5A623/FFFFFF?text=CS",
        genre: "fps",
      },
      {
        name: "League of Legends",
        description: "MOBA",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        icon: "https://via.placeholder.com/40/0097FF/FFFFFF?text=LOL",
        genre: "moba",
      },
    ];

    for (const game of sampleGames) {
      this.createGame(game);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      joinedAt: now,
      lastLogin: now,
      role: "user"
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLoginTime(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      user.lastLogin = new Date();
      this.users.set(userId, user);
    }
  }

  // User profile methods
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    return this.userProfiles.get(userId);
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const now = new Date();
    const userProfile: UserProfile = {
      ...profile,
      totalTournaments: 0,
      totalMatches: 0,
      wins: 0,
      points: 0,
      rank: null,
      gameStats: [],
      achievements: [],
      matchHistory: [],
      recentActivity: [],
      updatedAt: now,
    };
    this.userProfiles.set(profile.userId, userProfile);
    return userProfile;
  }

  async updateUserProfile(userId: number, profile: Partial<InsertUserProfile>): Promise<UserProfile> {
    const existingProfile = await this.getUserProfile(userId);
    if (!existingProfile) {
      throw new Error("User profile not found");
    }
    
    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...profile,
      updatedAt: new Date(),
    };
    
    this.userProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  // Tournament methods
  async getTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values());
  }

  async getLiveTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values()).filter(tournament => tournament.isLive);
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async createTournament(tournamentData: InsertTournament): Promise<Tournament> {
    const id = this.currentTournamentId++;
    const now = new Date();
    
    const tournament: Tournament = {
      ...tournamentData,
      id,
      currentTeams: 0,
      status: "upcoming",
      isLive: false,
      viewers: 0,
      stage: "Not Started",
      createdAt: now,
    };
    
    this.tournaments.set(id, tournament);
    return tournament;
  }

  async getUserTournaments(userId: number): Promise<Tournament[]> {
    // Find all tournament participants for this user
    const userTournaments: Tournament[] = [];
    
    for (const [tournamentId, participants] of this.tournamentParticipants.entries()) {
      if (participants.some(p => p.userId === userId)) {
        const tournament = await this.getTournament(tournamentId);
        if (tournament) {
          userTournaments.push(tournament);
        }
      }
    }
    
    return userTournaments;
  }

  async joinTournament(tournamentId: number, userId: number): Promise<TournamentParticipant> {
    const tournament = await this.getTournament(tournamentId);
    if (!tournament) {
      throw new Error("Tournament not found");
    }
    
    // Check if user is already in the tournament
    const participants = this.tournamentParticipants.get(tournamentId) || [];
    if (participants.some(p => p.userId === userId)) {
      throw new Error("User already joined this tournament");
    }
    
    // Check if tournament is full
    if (tournament.currentTeams >= tournament.maxTeams) {
      throw new Error("Tournament is full");
    }
    
    const id = this.currentParticipantId++;
    const participant: TournamentParticipant = {
      id,
      tournamentId,
      userId,
      teamId: null,
      joinedAt: new Date(),
      status: "active",
    };
    
    participants.push(participant);
    this.tournamentParticipants.set(tournamentId, participants);
    
    // Update tournament current teams count
    tournament.currentTeams += 1;
    this.tournaments.set(tournamentId, tournament);
    
    // Update user profile
    const profile = await this.getUserProfile(userId);
    if (profile) {
      profile.totalTournaments += 1;
      const now = new Date();
      const activity = {
        description: `Joined tournament: ${tournament.title}`,
        date: now.toISOString(),
      };
      
      if (!profile.recentActivity) {
        profile.recentActivity = [];
      }
      
      profile.recentActivity.unshift(activity);
      this.userProfiles.set(userId, profile);
    }
    
    return participant;
  }

  // Game methods
  async getGames(genre?: string, sort?: string): Promise<Game[]> {
    let games = Array.from(this.games.values());
    
    // Filter by genre if provided
    if (genre && genre !== "all") {
      games = games.filter(game => game.genre === genre);
    }
    
    // Sort games
    if (sort) {
      switch (sort) {
        case "popular":
          // Stub: In a real app, would sort by popularity metrics
          break;
        case "tournaments":
          // Stub: In a real app, would sort by tournament count
          break;
        case "prizepool":
          // Stub: In a real app, would sort by prize pool total
          break;
        case "newest":
          games.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        default:
          break;
      }
    }
    
    return games;
  }

  async getGamesList(): Promise<{ id: string, name: string }[]> {
    return Array.from(this.games.values()).map(game => ({
      id: game.id.toString(),
      name: game.name,
    }));
  }

  async getGameGenres(): Promise<{ id: string, name: string }[]> {
    const genreSet = new Set<string>();
    
    for (const game of this.games.values()) {
      genreSet.add(game.genre);
    }
    
    return Array.from(genreSet).map(genre => {
      let name = genre.charAt(0).toUpperCase() + genre.slice(1);
      if (genre === "fps") name = "FPS";
      if (genre === "moba") name = "MOBA";
      
      return {
        id: genre,
        name,
      };
    });
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createGame(gameData: InsertGame): Promise<Game> {
    const id = this.currentGameId++;
    const now = new Date();
    
    const game: Game = {
      ...gameData,
      id,
      createdAt: now,
      active: true,
    };
    
    this.games.set(id, game);
    return game;
  }

  // Leaderboard methods
  async getLeaderboard(game?: string, region?: string): Promise<any[]> {
    // In a real app, this would query the leaderboard table
    // For this demo, return some sample players
    const samplePlayers = [
      {
        id: 1,
        rank: 1,
        username: "NinjaWarrior",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        country: "United States",
        game: "Valorant",
        gameIcon: "https://via.placeholder.com/20/FF4655/FFFFFF?text=VAL",
        wins: 214,
        points: 9458,
        winRate: 78,
        isOnline: true,
      },
      {
        id: 2,
        rank: 2,
        username: "PixelQueen",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        country: "South Korea",
        game: "Fortnite",
        gameIcon: "https://via.placeholder.com/20/9D4DFF/FFFFFF?text=FN",
        wins: 189,
        points: 8942,
        winRate: 73,
        isOnline: true,
      },
      {
        id: 3,
        rank: 3,
        username: "HeadShotKing",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        country: "Germany",
        game: "CS:GO",
        gameIcon: "https://via.placeholder.com/20/F5A623/FFFFFF?text=CS",
        wins: 176,
        points: 8105,
        winRate: 68,
        isOnline: false,
      },
      {
        id: 4,
        rank: 4,
        username: "FragMaster",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg",
        country: "Canada",
        game: "Valorant",
        gameIcon: "https://via.placeholder.com/20/FF4655/FFFFFF?text=VAL",
        wins: 162,
        points: 7890,
        winRate: 65,
        isOnline: true,
      },
      {
        id: 5,
        rank: 5,
        username: "SniperElite",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
        country: "Brazil",
        game: "Fortnite",
        gameIcon: "https://via.placeholder.com/20/9D4DFF/FFFFFF?text=FN",
        wins: 159,
        points: 7456,
        winRate: 61,
        isOnline: false,
      },
    ];
    
    // Filter by game if provided
    if (game && game !== "all") {
      return samplePlayers.filter(player => player.game.toLowerCase() === game.toLowerCase());
    }
    
    // Filter by region if provided
    if (region && region !== "all") {
      // In a real app, this would filter by player region
    }
    
    return samplePlayers;
  }

  async getTopPlayers(): Promise<any[]> {
    // Return top 5 players
    return this.getLeaderboard();
  }
}

export const storage = new MemStorage();
