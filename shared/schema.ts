import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  bio: text("bio"),
  avatar: text("avatar"),
  country: text("country"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  role: text("role").default("user").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  country: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Games table
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  icon: text("icon").notNull(),
  genre: text("genre").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  active: boolean("active").default(true).notNull(),
});

export const insertGameSchema = createInsertSchema(games).pick({
  name: true,
  description: true,
  image: true,
  icon: true,
  genre: true,
});

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

// Tournaments table
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  gameId: integer("game_id").notNull(),
  image: text("image").notNull(),
  prizePool: text("prize_pool").notNull(),
  maxTeams: integer("max_teams").notNull(),
  currentTeams: integer("current_teams").default(0).notNull(),
  region: text("region").notNull(),
  format: text("format").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: text("status").default("upcoming").notNull(), // upcoming, live, completed, canceled
  rules: text("rules"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isLive: boolean("is_live").default(false),
  viewers: integer("viewers").default(0),
  stage: text("stage").default("Not Started"),
});

export const insertTournamentSchema = createInsertSchema(tournaments).pick({
  title: true,
  description: true,
  gameId: true,
  image: true,
  prizePool: true,
  maxTeams: true,
  region: true,
  format: true,
  startDate: true,
  endDate: true,
  rules: true,
});

export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;

// Tournament Participants
export const tournamentParticipants = pgTable("tournament_participants", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull(),
  userId: integer("user_id").notNull(),
  teamId: integer("team_id"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  status: text("status").default("active").notNull(), // active, disqualified
}, (table) => {
  return {
    unq: uniqueIndex("tournament_user_unique").on(table.tournamentId, table.userId),
  };
});

// Matches
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull(),
  round: integer("round").notNull(),
  matchNumber: integer("match_number").notNull(),
  team1Id: integer("team1_id"),
  team2Id: integer("team2_id"),
  team1Score: integer("team1_score").default(0),
  team2Score: integer("team2_score").default(0),
  winnerId: integer("winner_id"),
  loserId: integer("loser_id"),
  status: text("status").default("scheduled").notNull(), // scheduled, live, completed
  scheduledTime: timestamp("scheduled_time"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  // Additional match details (could be JSON for flexibility)
  details: jsonb("details"),
});

// User Profiles 
export const userProfiles = pgTable("user_profiles", {
  userId: integer("user_id").primaryKey(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatar: text("avatar"),
  country: text("country"),
  mainGame: integer("main_game"),
  totalTournaments: integer("total_tournaments").default(0),
  totalMatches: integer("total_matches").default(0),
  wins: integer("wins").default(0),
  points: integer("points").default(0),
  rank: integer("rank"),
  // Store JSON for game-specific stats
  gameStats: jsonb("game_stats"),
  // Store JSON for achievements
  achievements: jsonb("achievements"),
  // Store JSON for match history
  matchHistory: jsonb("match_history"),
  // Store JSON for recent activity
  recentActivity: jsonb("recent_activity"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Teams
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tag: text("tag").notNull(),
  logo: text("logo"),
  ownerId: integer("owner_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Team Members
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").default("member").notNull(), // owner, captain, member
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => {
  return {
    unq: uniqueIndex("team_user_unique").on(table.teamId, table.userId),
  };
});

// Leaderboard
export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  username: text("username").notNull(),
  gameId: integer("game_id"),
  rank: integer("rank").notNull(),
  points: integer("points").default(0).notNull(),
  wins: integer("wins").default(0).notNull(),
  totalMatches: integer("total_matches").default(0).notNull(),
  winRate: integer("win_rate").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert and select types for other entities
export const insertTournamentParticipantSchema = createInsertSchema(tournamentParticipants).pick({
  tournamentId: true,
  userId: true,
  teamId: true,
});

export const insertMatchSchema = createInsertSchema(matches).pick({
  tournamentId: true,
  round: true,
  matchNumber: true,
  team1Id: true,
  team2Id: true,
  scheduledTime: true,
  details: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  userId: true,
  displayName: true,
  bio: true,
  avatar: true,
  country: true,
  mainGame: true,
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  tag: true,
  logo: true,
  ownerId: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  teamId: true,
  userId: true,
  role: true,
});

// Export types
export type InsertTournamentParticipant = z.infer<typeof insertTournamentParticipantSchema>;
export type TournamentParticipant = typeof tournamentParticipants.$inferSelect;

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export type Leaderboard = typeof leaderboard.$inferSelect;
