import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const { question, chapterContent, history } = await req.json();

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `
तुम एक अनुभवी और धैर्यशील हिंदी शिक्षक हो जो B.A. और M.A. के छात्रों को पढ़ाते हो।
नीचे दिए गए Chapter के Notes के आधार पर छात्र के सवाल का जवाब दो।

नियम:
1. हमेशा सरल और स्पष्ट हिंदी में जवाब दो
2. जवाब को points में समझाओ
3. कठिन शब्दों का अर्थ भी बताओ
4. उदाहरण देकर समझाओ
5. अंत में पूछो "क्या आप और समझना चाहते हैं?"
6. छात्र को encourage करो
7. अगर सवाल notes से बाहर का है तो विनम्रता से बताओ

📖 Chapter Notes:
${chapterContent}
    `
  });

  const chat = model.startChat({ history: history || [] });
  const result = await chat.sendMessage(question);

  return Response.json({ answer: result.response.text() });
}
