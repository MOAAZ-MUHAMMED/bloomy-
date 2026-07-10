import { type User, type InsertUser, type ChildProfile, type InsertChildProfile, users, childProfiles } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Child Profile CRUD
  getChildProfiles(): Promise<ChildProfile[]>;
  createOrUpdateChildProfile(profile: any): Promise<ChildProfile>;
  updateChildStars(id: string, stars: number): Promise<void>;
  updateChildFarmData(id: string, farmData: string): Promise<void>;
  deleteChildProfile(id: string): Promise<void>;
}

export class FileStorage implements IStorage {
  private users: Map<string, User>;
  private childProfiles: Map<string, ChildProfile>;
  private filePath: string;

  constructor() {
    this.users = new Map();
    this.childProfiles = new Map();
    this.filePath = path.resolve(process.cwd(), "profiles.json");
    this.loadProfiles();
  }

  private loadProfiles() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, "utf-8");
        const list = JSON.parse(data);
        for (const p of list) {
          this.childProfiles.set(p.id, p);
        }
      }
    } catch (e) {
      console.warn("Failed to load profiles.json:", e);
    }
  }

  private saveProfiles() {
    try {
      const list = Array.from(this.childProfiles.values());
      fs.writeFileSync(this.filePath, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed to save profiles.json:", e);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChildProfiles(): Promise<ChildProfile[]> {
    return Array.from(this.childProfiles.values());
  }

  async createOrUpdateChildProfile(profile: any): Promise<ChildProfile> {
    const existing = this.childProfiles.get(profile.id);
    const updated: ChildProfile = {
      id: profile.id,
      gender: profile.gender,
      name: profile.name,
      age: profile.age,
      phone: profile.phone,
      level: profile.level,
      country: profile.country || "غير محدد",
      stars: profile.stars ?? existing?.stars ?? 0,
      farmData: profile.farmData ?? existing?.farmData ?? null
    };
    this.childProfiles.set(profile.id, updated);
    this.saveProfiles();
    return updated;
  }

  async updateChildStars(id: string, stars: number): Promise<void> {
    const existing = this.childProfiles.get(id);
    if (existing) {
      existing.stars = stars;
      this.childProfiles.set(id, existing);
      this.saveProfiles();
    }
  }

  async updateChildFarmData(id: string, farmData: string): Promise<void> {
    const existing = this.childProfiles.get(id);
    if (existing) {
      existing.farmData = farmData;
      this.childProfiles.set(id, existing);
      this.saveProfiles();
    }
  }

  async deleteChildProfile(id: string): Promise<void> {
    if (this.childProfiles.has(id)) {
      this.childProfiles.delete(id);
      this.saveProfiles();
    }
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not connected");
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not connected");
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error("Database not connected");
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getChildProfiles(): Promise<ChildProfile[]> {
    if (!db) throw new Error("Database not connected");
    return await db.select().from(childProfiles);
  }

  async createOrUpdateChildProfile(profile: any): Promise<ChildProfile> {
    if (!db) throw new Error("Database not connected");
    const [existing] = await db.select().from(childProfiles).where(eq(childProfiles.id, profile.id));
    if (existing) {
      const [updated] = await db
        .update(childProfiles)
        .set({
          gender: profile.gender,
          name: profile.name,
          age: profile.age,
          phone: profile.phone,
          level: profile.level,
          country: profile.country || existing.country,
          stars: profile.stars ?? existing.stars,
          farmData: profile.farmData ?? existing.farmData
        })
        .where(eq(childProfiles.id, profile.id))
        .returning();
      return updated;
    } else {
      const [inserted] = await db
        .insert(childProfiles)
        .values({
          id: profile.id,
          gender: profile.gender,
          name: profile.name,
          age: profile.age,
          phone: profile.phone,
          level: profile.level,
          country: profile.country || "غير محدد",
          stars: profile.stars ?? 0,
          farmData: profile.farmData ?? null
        })
        .returning();
      return inserted;
    }
  }

  async updateChildStars(id: string, stars: number): Promise<void> {
    if (!db) throw new Error("Database not connected");
    await db
      .update(childProfiles)
      .set({ stars })
      .where(eq(childProfiles.id, id));
  }

  async updateChildFarmData(id: string, farmData: string): Promise<void> {
    if (!db) throw new Error("Database not connected");
    await db
      .update(childProfiles)
      .set({ farmData })
      .where(eq(childProfiles.id, id));
  }

  async deleteChildProfile(id: string): Promise<void> {
    if (!db) throw new Error("Database not connected");
    await db
      .delete(childProfiles)
      .where(eq(childProfiles.id, id));
  }
}

export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new FileStorage();
