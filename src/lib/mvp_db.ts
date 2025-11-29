// lib/db.ts
import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("projects_mvp.db");

// One-time init
export function initDb() {
    console.log("intializing db")
    db.execSync("BEGIN");
    db.execSync("PRAGMA journal_mode = WAL;");
    db.execSync('PRAGMA foreign_keys = ON');

    // CALVIN MVP DATABASE SCHEMA -------------------
    db.execSync(`
        CREATE TABLE IF NOT EXISTS PROJECTS_USER (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            admin_contact TEXT NOT NULL,
            organization TEXT NOT NULL,
            description TEXT,
            protocol_pdf TEXT,
            allowed_contributors TEXT,
            prompts TEXT,
            images TEXT,
            last_updated TEXT,
            labeled_count INTEGER NOT NULL,
            total_prompt_count INTEGER
        );
    `);
    db.execSync(`
        CREATE TABLE IF NOT EXISTS PROMPTS (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER,
            question_text TEXT,
            FOREIGN KEY (project_id) REFERENCES PROJECTS_USER(id)
        )
    `);
    // answer options
    db.execSync(`
        CREATE TABLE IF NOT EXISTS PROMPT_OPTION (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt_id INTEGER,
            option_text TEXT,
            order_index INTEGER,
            FOREIGN KEY (prompt_id) REFERENCES PROMPTS(id)
        )
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS IMAGES (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER,
            file_path TEXT NOT NULL,
            order_index INTEGER,
            FOREIGN KEY (project_id) REFERENCES PROJECTS_USER(id)
        )
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS LABEL_RESPONSES (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER,
            image_id INTEGER,
            selected_answer INTEGER,
            FOREIGN KEY (selected_answer) REFERENCES PROMPT_OPTION(id),
            FOREIGN KEY (image_id) REFERENCES IMAGES(id),
            FOREIGN KEY (project_id) REFERENCES PROJECTS_USER(id)
        )
    `);

    console.log("Database successfully initialized!!!")
    db.execSync("COMMIT");
    // db.execSync('COMMIT');
}
export function clearDbData() {
    console.log("clearing all stored data from database (keeping schema)")
    const tables = db.getAllSync<{ name: string }>(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
    );
    for (const { name } of tables) {
        db.execSync(`DELETE FROM ${name};`);
    }
    console.log("cleared table data")

}
export function clearDbSchema() {
    console.log("clearing the whole database (schema and all)")
    console.log("Clearing all tables...");

    const tables = db.getAllSync<{ name: string }>(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
    );

    for (const { name } of tables) {
        db.execSync(`DROP TABLE IF EXISTS ${name};`);
    }
    console.log("cleared table schema")
}

// // Simple id helper (MVP, going to need an adjustment)
// export function newId() {
//     return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
// }
