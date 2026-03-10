import mammoth from "mammoth";
import { saveChapters, getChapters } from "@/lib/store";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const subject = formData.get("subject");
  const level = formData.get("level");

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value;

  const chapterRegex = /(?:अध्याय|Chapter|CHAPTER|इकाई|Unit)\s*[-:]?\s*\d+/gi;
  const parts = text.split(chapterRegex).filter(p => p.trim().length > 50);
  const headings = [...text.matchAll(chapterRegex)].map(m => m[0]);

  const chapters = parts.map((content, i) => ({
    id: `${subject}-${i + 1}`.toLowerCase().replace(/\s+/g, "-"),
    title: headings[i] || `अध्याय ${i + 1}`,
    subject,
    level,
    content: content.trim(),
    createdAt: new Date().toISOString()
  }));

  await saveChapters(chapters);
  return Response.json({ success: true, count: chapters.length });
}

export async function GET() {
  const chapters = await getChapters();
  return Response.json({ chapters });
}
