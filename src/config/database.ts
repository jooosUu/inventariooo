import Database from 'better-sqlite3';
import { join } from 'path';

// Singleton para la conexión a la base de datos
let db: Database.Database | null = null;

export const getDatabase = () => {
  if (!db) {
    db = new Database(join(process.cwd(), 'inventory.db'));
    db.pragma('foreign_keys = ON');
  }
  return db;
};