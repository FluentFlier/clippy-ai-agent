import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

export interface HistoryEntry {
  id?: number;
  action: string;
  prompt: string;
  result: string;
  timestamp: number;
  metadata?: string;
}

export class DatabaseManager {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'clippy.db');
    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        prompt TEXT,
        result TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        data TEXT,
        timestamp INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history(timestamp);
      CREATE INDEX IF NOT EXISTS idx_history_action ON history(action);
      CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
    `);
  }

  // History methods
  addHistory(entry: HistoryEntry): number {
    const stmt = this.db.prepare(`
      INSERT INTO history (action, prompt, result, timestamp, metadata)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      entry.action,
      entry.prompt || '',
      entry.result,
      entry.timestamp,
      entry.metadata || null
    );
    return info.lastInsertRowid as number;
  }

  getHistory(limit = 50): HistoryEntry[] {
    const stmt = this.db.prepare(`
      SELECT * FROM history
      ORDER BY timestamp DESC
      LIMIT ?
    `);
    return stmt.all(limit) as HistoryEntry[];
  }

  searchHistory(query: string): HistoryEntry[] {
    const stmt = this.db.prepare(`
      SELECT * FROM history
      WHERE result LIKE ? OR prompt LIKE ?
      ORDER BY timestamp DESC
      LIMIT 50
    `);
    return stmt.all(`%${query}%`, `%${query}%`) as HistoryEntry[];
  }

  deleteHistory(id: number): void {
    const stmt = this.db.prepare('DELETE FROM history WHERE id = ?');
    stmt.run(id);
  }

  clearHistory(): void {
    this.db.exec('DELETE FROM history');
  }

  // Analytics methods
  trackEvent(eventType: string, data?: any): void {
    const stmt = this.db.prepare(`
      INSERT INTO analytics (event_type, data, timestamp)
      VALUES (?, ?, ?)
    `);
    stmt.run(eventType, JSON.stringify(data || {}), Date.now());
  }

  getAnalytics(days = 7): any[] {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    const stmt = this.db.prepare(`
      SELECT * FROM analytics
      WHERE timestamp > ?
      ORDER BY timestamp DESC
    `);
    return stmt.all(cutoff);
  }

  close(): void {
    this.db.close();
  }
}
