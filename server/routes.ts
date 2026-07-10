import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Custom CORS headers middleware for development
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // GET all child profiles
  app.get("/api/child-profiles", async (req, res) => {
    try {
      const list = await storage.getChildProfiles();
      res.json(list);
    } catch (e) {
      console.error("Fetch profiles error:", e);
      res.status(500).json({ error: "Failed to fetch child profiles" });
    }
  });

  // POST create/update child profile
  app.post("/api/child-profiles", async (req, res) => {
    try {
      const profile = req.body;
      if (!profile || !profile.id || !profile.name || !profile.phone) {
        return res.status(400).json({ error: "Missing required fields (id, name, phone)" });
      }
      const saved = await storage.createOrUpdateChildProfile(profile);
      res.json(saved);
    } catch (e) {
      console.error("Save profile error:", e);
      res.status(500).json({ error: "Failed to save child profile" });
    }
  });

  // POST update child stars
  app.post("/api/child-profiles/:id/stars", async (req, res) => {
    try {
      const id = req.params.id;
      const { stars } = req.body;
      if (stars === undefined || isNaN(parseInt(stars, 10))) {
        return res.status(400).json({ error: "Invalid stars count" });
      }
      await storage.updateChildStars(id, parseInt(stars, 10));
      res.json({ success: true });
    } catch (e) {
      console.error("Update stars error:", e);
      res.status(500).json({ error: "Failed to update stars" });
    }
  });

  // POST update child farm data
  app.post("/api/child-profiles/:id/farm", async (req, res) => {
    try {
      const id = req.params.id;
      const { farmData } = req.body;
      if (farmData === undefined) {
        return res.status(400).json({ error: "Invalid farm data" });
      }
      await storage.updateChildFarmData(id, farmData);
      res.json({ success: true });
    } catch (e) {
      console.error("Update farm data error:", e);
      res.status(500).json({ error: "Failed to update farm data" });
    }
  });

  // DELETE child profile
  app.delete("/api/child-profiles/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Missing id" });
      }
      await storage.deleteChildProfile(id);
      res.json({ success: true });
    } catch (e) {
      console.error("Delete profile error:", e);
      res.status(500).json({ error: "Failed to delete profile" });
    }
  });

  return httpServer;
}
