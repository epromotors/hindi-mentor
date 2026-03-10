import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "chapters.json");

// data folder बनाओ अगर नहीं है
function ensureDB() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]");
}

export async function saveChapters(newChapters) {
  ensureDB();
  const existing = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  
  // Same subject के पुराने chapters replace करो
  const subject = newChapters[0]?.subject;
  const filtered = existing.filter(c => c.subject !== subject);
  const updated = [...filtered, ...newChapters];
  
  fs.writeFileSync(DB_PATH, JSON.stringify(updated, null, 2));
}

export async function getChapters() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

export async function getChapterById(id) {
  ensureDB();
  const chapters = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  return chapters.find(c => c.id === id) || null;
}
