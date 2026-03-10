import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const { chapterContent, chapterTitle, count = 5 } = await req.json();

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
नीचे दिए गए chapter "${chapterTitle}" के notes से ${count} MCQ प्रश्न बनाओ।

नियम:
- सभी प्रश्न और विकल्प हिंदी में हों
- हर प्रश्न के 4 विकल्प हों (A, B, C, D)
- सही उत्तर और संक्षिप्त explanation भी दो
- B.A./M.A. स्तर के प्रश्न हों

JSON format में return करो:
[
  {
    "question": "प्रश्न यहाँ",
    "options": { "A": "विकल्प 1", "B": "विकल्प 2", "C": "विकल्प 3", "D": "विकल्प 4" },
    "correct": "A",
    "explanation": "सही उत्तर क्यों है"
  }
]

Chapter Notes:
${chapterContent.substring(0, 8000)}
  `;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

  return Response.json({ questions });
}
