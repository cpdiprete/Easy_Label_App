// lib/db.ts
import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("projects_mvp.db");

// One-time init
export function initDb() {
    console.log("intializing db")
    db.execSync("PRAGMA journal_mode = WAL;");

    db.execSync(`
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            admin TEXT NOT NULL,
            organization TEXT NOT NULL,
            protocolpdf TEXT,
            description TEXT,
            createdAt INTEGER NOT NULL,
            updatedAt INTEGER NOT NULL
        );
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS prompts (
            id TEXT PRIMARY KEY,
            projectId TEXT NOT NULL,
            question TEXT NOT NULL,
            orderIndex INTEGER NOT NULL,
            updatedAt INTEGER NOT NULL
        );
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS prompt_options (
            id TEXT PRIMARY KEY,
            promptId TEXT NOT NULL,
            text TEXT NOT NULL,
            orderIndex INTEGER NOT NULL,
            updatedAt INTEGER NOT NULL
        );
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS project_images (
            id TEXT PRIMARY KEY,
            projectId TEXT NOT NULL,
            uri TEXT NOT NULL,         -- file://… (local) or http(s)://… later
            updatedAt INTEGER NOT NULL
        );
    `);
}

// Simple id helper (good enough for local MVP)
export function newId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
