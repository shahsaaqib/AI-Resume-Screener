import { FastifyInstance } from "fastify";
import prisma from "../../lib/prisma";
import OpenAI from "openai/index.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Resume Screener",
  },
});

export default async function analyzeRoutes(app: FastifyInstance) {
  app.post("/analyze/:id", async (req, reply) => {
    try {
      const { id } = req.params as { id: string };

      // Fetch resume text from DB
      const resume = await prisma.resume.findUnique({ where: { id } });
      if (!resume) {
        return reply.status(404).send({ error: "Resume not found" });
      }

      // ✅ If already analyzed, skip re-analysis
      if (resume.status === "analyzed" && resume.analysis) {
        return reply.status(200).send({
          message: "Resume already analyzed",
          id,
          analysis: resume.analysis,
        });
      }

      const resumeText = resume.text;
      if (!resumeText || resumeText.length < 100) {
        return reply.status(422).send({ error: "Resume text is too short for analysis" });
      }

      // Update status to "processing"
      await prisma.resume.update({
        where: { id },
        data: { status: "processing" },
      });

      // Build the AI prompt
      const prompt = `
You are an expert HR recruiter. Analyze the following resume text and provide a structured JSON response.
Include:
- name
- top_skills (array)
- years_of_experience
- education_summary
- professional_summary
- strengths
- weaknesses
- overall_score (0–100)

Resume Text:
${resumeText}
`;

      // Call OpenRouter model
      const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "system", content: "You are a precise and structured HR resume analyst." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      });

      const aiResponse = completion.choices?.[0]?.message?.content || "";

      // --- Clean and parse the AI output ---
      let analysis: any;
      try {
        let output = aiResponse || "";
        output = output.replace(/```json/i, "").replace(/```/g, "").trim();
        analysis = JSON.parse(output);
      } catch {
        analysis = { raw_output: aiResponse };
      }

      // ✅ Save analysis and update status
      await prisma.resume.update({
        where: { id },
        data: {
          status: "analyzed",
          analysis,
        },
      });

      return reply.status(200).send({
        message: "Resume analyzed successfully",
        id,
        analysis,
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      // mark as failed
      if (req.params && (req.params as any).id) {
        await prisma.resume.update({
          where: { id: (req.params as any).id },
          data: { status: "failed" },
        });
      }
      return reply.status(500).send({
        error: "Failed to analyze resume",
        details: error.message,
      });
    }
  });
}
