import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Personal info table
export const personalInfo = pgTable("personal_info", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  email: text("contact_email").notNull(),
  githubUrl: text("github_url"),
  githubLabel: text("github_label"),
  scholarUrl: text("scholar_url"),
  linkedinUrl: text("linkedin_url"),
  researchInterests: text("research_interests"), // JSON string
  updatedAt: timestamp("updated_at").defaultNow(),
});

// About paragraphs
export const aboutParagraphs = pgTable("about_paragraphs", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

// Education
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  degree: text("degree").notNull(),
  university: text("university").notNull(),
  period: text("period").notNull(),
  grade: text("grade"),
  orderIndex: integer("order_index").notNull().default(0),
});

// Experience
export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  period: text("period").notNull(),
  course: text("course"),
  professors: text("professors"),
  orderIndex: integer("order_index").notNull().default(0),
});

// Publications
export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  venue: text("venue").notNull(),
  authors: text("authors").notNull(),
  year: integer("year").notNull(),
  type: text("type").notNull().default("Conference"),
  abstract: text("abstract"),
  paperUrl: text("paper_url"),
  codeUrl: text("code_url"),
  bibtex: text("bibtex"),
  featured: boolean("featured").default(false),
  orderIndex: integer("order_index").notNull().default(0),
});

// News/Updates
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  content: text("content").notNull(),
  highlight: boolean("highlight").default(false),
  category: text("category").notNull().default("General"),
  orderIndex: integer("order_index").notNull().default(0),
});

// Upcoming events
export const upcomingEvents = pgTable("upcoming_events", {
  id: serial("id").primaryKey(),
  event: text("event").notNull(),
  date: text("date").notNull(),
  location: text("location"),
  role: text("role"),
  orderIndex: integer("order_index").notNull().default(0),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PersonalInfo = typeof personalInfo.$inferSelect;
export type AboutParagraph = typeof aboutParagraphs.$inferSelect;
export type Education = typeof education.$inferSelect;
export type Experience = typeof experience.$inferSelect;
export type Publication = typeof publications.$inferSelect;
export type News = typeof news.$inferSelect;
export type UpcomingEvent = typeof upcomingEvents.$inferSelect;
