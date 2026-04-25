import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Database setup
const db = new Database("neural_pulse.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS scan_config (
    id INTEGER PRIMARY KEY,
    is_active INTEGER DEFAULT 0,
    interval_minutes INTEGER DEFAULT 60,
    last_scan_at TEXT,
    keywords TEXT
  );
  
  CREATE TABLE IF NOT EXISTS scan_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    manga_name TEXT,
    report_json TEXT,
    found_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  INSERT OR IGNORE INTO scan_config (id, is_active, interval_minutes, keywords) 
  VALUES (1, 0, 60, 'cozy romance, slice of life, no drama');
`);

app.use(express.json());

// Gemini Setup
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Background Worker Simulation
let scanTimeout: NodeJS.Timeout | null = null;

async function performScan() {
  // Clear any existing timeout to prevent multiple loops
  if (scanTimeout) {
    clearTimeout(scanTimeout);
    scanTimeout = null;
  }

  const config: any = db.prepare("SELECT * FROM scan_config WHERE id = 1").get();
  if (!config || !config.is_active) {
    console.log("Background scan is inactive or not configured.");
    return;
  }

  console.log("Starting background neural scan...");
  
  try {
    const prompt = `Search for 3 manga/manhwa titles that match these keywords: "${config.keywords}". 
    
    STRICT COMPLIANCE MANDATE: You MUST be 100% accurate. 
    - REJECT any title with love triangles, rivals, or unrequited love from side characters.
    - REJECT any title with heavy drama or trauma.
    - REJECT any title that doesn't have perfectly balanced (50/50) POVs for both lead characters.
    - REJECT any title with age gaps or adult-teen romance.
    
    For each title, provide a brief cozy report in JSON format. 
    Return an array of objects with: { name, summary, cozinessScore (0-100), whyItMatches }.
    Return ONLY the JSON.`;

    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    const text = response.text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      const results = JSON.parse(jsonMatch[0]);
      const insert = db.prepare("INSERT INTO scan_results (manga_name, report_json) VALUES (?, ?)");
      for (const r of results) {
        insert.run(r.name, JSON.stringify(r));
      }
      db.prepare("UPDATE scan_config SET last_scan_at = CURRENT_TIMESTAMP WHERE id = 1").run();
      console.log(`Background scan complete. Found ${results.length} titles.`);
    }
  } catch (error) {
    console.error("Background scan failed:", error);
  }

  // Schedule next scan
  const currentConfig: any = db.prepare("SELECT * FROM scan_config WHERE id = 1").get();
  if (currentConfig && currentConfig.is_active) {
    const nextInterval = (currentConfig.interval_minutes || 60) * 60 * 1000;
    console.log(`Scheduling next scan in ${currentConfig.interval_minutes} minutes.`);
    scanTimeout = setTimeout(performScan, nextInterval);
  }
}

// API Routes
app.get("/api/pulse/config", (req, res) => {
  const config = db.prepare("SELECT * FROM scan_config WHERE id = 1").get();
  res.json({
    ...config,
    is_active: !!config.is_active // Convert to boolean for frontend
  });
});

app.post("/api/pulse/config", (req, res) => {
  const { is_active, interval_minutes, keywords } = req.body;
  const oldConfig: any = db.prepare("SELECT * FROM scan_config WHERE id = 1").get();
  
  db.prepare("UPDATE scan_config SET is_active = ?, interval_minutes = ?, keywords = ? WHERE id = 1")
    .run(is_active ? 1 : 0, interval_minutes, keywords);
  
  // If it was turned on, start the scan
  if (is_active && !oldConfig.is_active) {
    performScan();
  } else if (!is_active && scanTimeout) {
    // If it was turned off, clear the timeout
    clearTimeout(scanTimeout);
    scanTimeout = null;
  }
  
  res.json({ status: "ok" });
});

app.get("/api/pulse/results", (req, res) => {
  const results = db.prepare("SELECT * FROM scan_results ORDER BY found_at DESC LIMIT 50").all();
  res.json(results.map((r: any) => ({ ...r, report: JSON.parse(r.report_json) })));
});

app.delete("/api/pulse/results/:id", (req, res) => {
  db.prepare("DELETE FROM scan_results WHERE id = ?").run(req.params.id);
  res.json({ status: "ok" });
});

// Start initial scan if active
const initialConfig: any = db.prepare("SELECT * FROM scan_config WHERE id = 1").get();
if (initialConfig && initialConfig.is_active) {
  performScan();
}

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
