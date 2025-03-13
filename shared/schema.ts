import { pgTable, text, serial, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  country: text("country"),
  bio: text("bio"),
  avatar: text("avatar"),
  skillLevel: text("skill_level"),
  discordUsername: text("discord_username"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  activePlayers: integer("active_players").default(0),
  tournamentCount: integer("tournament_count").default(0),
});

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gameId: integer("game_id").notNull(),
  image: text("image").notNull(),
  description: text("description"),
  prizePool: integer("prize_pool").default(0),
  entryFee: integer("entry_fee").default(1000), // Default $10.00 (in cents)
  teamSize: integer("team_size").default(1),
  playerLimit: integer("player_limit"),
  startDate: timestamp("start_date").notNull(),
  status: text("status").notNull().default("upcoming"),
});

export const tournamentParticipants = pgTable("tournament_participants", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull(),
  userId: integer("user_id").notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull(),
  player1Id: integer("player1_id").notNull(),
  player2Id: integer("player2_id").notNull(),
  winnerId: integer("winner_id"),
  score: text("score"),
  matchDate: timestamp("match_date"),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  points: integer("points").default(0),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  rank: integer("rank").default(0),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  country: true,
  bio: true,
  avatar: true,
  skillLevel: true,
  discordUsername: true,
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Invalid email format"),
});

export const insertGameSchema = createInsertSchema(games).pick({
  name: true,
  image: true,
  activePlayers: true,
  tournamentCount: true,
});

export const insertTournamentSchema = createInsertSchema(tournaments).pick({
  name: true,
  gameId: true,
  image: true,
  description: true,
  prizePool: true,
  entryFee: true,
  teamSize: true,
  playerLimit: true,
  startDate: true,
  status: true,
});

export const insertTournamentParticipantSchema = createInsertSchema(tournamentParticipants).pick({
  tournamentId: true,
  userId: true,
});

export const insertMatchSchema = createInsertSchema(matches).pick({
  tournamentId: true,
  player1Id: true,
  player2Id: true,
  winnerId: true,
  score: true,
  matchDate: true,
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).pick({
  userId: true,
  points: true,
  wins: true,
  losses: true,
  rank: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;

export type InsertTournamentParticipant = z.infer<typeof insertTournamentParticipantSchema>;
export type TournamentParticipant = typeof tournamentParticipants.$inferSelect;

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type Leaderboard = typeof leaderboard.$inferSelect;

// Login Schema (used by client)
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof loginSchema>;
