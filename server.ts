import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API endpoint for AI teacher feedback on student's future transport idea
app.post("/api/ai-feedback", async (req, res) => {
  try {
    const { idea, transportName } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        feedback: `[AI 쌤의 따뜻한 칭찬] "${transportName || '미래 교통수단'}" 아이디어가 참신하고 멋져요! 환경을 보호하고 사람들이 편리하게 이동할 수 있는 훌륭한 상상력이네요. (API 키가 설정되면 더 자세한 AI 피드백을 받을 수 있습니다.)`,
        score: 95
      });
    }

    const prompt = `초등학교 3학년 사회 '교통수단의 발달' 단원을 공부하는 학생이 자신이 상상한 미래의 교통수단(${transportName})에 대해 다음과 같이 적었습니다.
내용: "${idea}"

초등학교 3학년 눈높이에 맞춰 친절하고 격려해주는 선생님 톤으로 칭찬과 함께 왜 이 교통수단이 환경과 생활에 좋은지 보완점이나 칭찬을 한두 문장으로 작성해 주세요. 또한 격려 점수(80~100점 사이)를 정수 형태로 알려주세요.
JSON 형식으로 응답해주세요:
{
  "feedback": "...",
  "score": 95
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("AI feedback error:", error);
    res.status(500).json({ error: error.message || "AI 피드백 생성 실패" });
  }
});

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
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
