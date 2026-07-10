import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const childProfiles = pgTable("child_profiles", {
  id: varchar("id").primaryKey(),
  gender: text("gender").notNull(),
  name: text("name").notNull(),
  age: text("age").notNull(),
  phone: text("phone").notNull(),
  level: text("level").notNull(),
  country: text("country").default("غير محدد").notNull(),
  stars: integer("stars").notNull().default(0),
  farmData: text("farm_data"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChildProfileSchema = createInsertSchema(childProfiles);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChildProfile = z.infer<typeof insertChildProfileSchema>;
export type ChildProfile = typeof childProfiles.$inferSelect;
