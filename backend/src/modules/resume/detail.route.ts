import { FastifyInstance } from "fastify";
import prisma from "../../lib/prisma";

/**
 * Utility function to safely extract JSON from any messy AI output
 */
function extractJSONFromString(raw: string): any {
  if (!raw) return null;

  // Remove code fences and markdown decorations
  let clean = raw
    .replace(/```json/i, "")
    .replace(/```/g, "")
    .replace(/Here\s+is[\s\S]*?:/i, "")
    .replace(/Note:[\s\S]*$/i, "")
    .trim();

  // Try direct JSON parse first
  try {
    return JSON.parse(clean);
  } catch {
    // If that fails, try to extract the first {...} JSON object from text
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (err) {
        console.warn("Partial JSON parse failed:", err);
      }
    }
  }

  // As a last resort, return the cleaned raw text
  return { raw_output: raw };
}

export default async function detailResumeRoutes(app: FastifyInstance) {
  app.get("/resume/:id", async (req, reply) => {
    try {
      const { id } = req.params as { id: string };

      const resume = await prisma.resume.findUnique({
        where: { id },
        select: {
          id: true,
          filename: true,
          createdAt: true,
          text: true,
          status: true,
          analysis: true,
        },
      });

      if (!resume) {
        return reply.status(404).send({ error: "Resume not found" });
      }

      let parsedAnalysis: any = null;

      if (resume.analysis) {
        try {
          // Handle multiple structures: raw_output, object, or plain string
          if (typeof resume.analysis === "string") {
            parsedAnalysis = extractJSONFromString(resume.analysis);
          } else if (resume.analysis.raw_output) {
            parsedAnalysis = extractJSONFromString(resume.analysis.raw_output);
          } else {
            parsedAnalysis = resume.analysis;
          }
        } catch (err) {
          console.warn("Failed to dynamically parse AI analysis JSON:", err);
          parsedAnalysis = { error: "Failed to parse analysis", raw: resume.analysis };
        }
      }

      const textPreview =
        resume.text.length > 1500
          ? resume.text.substring(0, 1500) + "..."
          : resume.text;

      return reply.status(200).send({
        id: resume.id,
        filename: resume.filename,
        createdAt: resume.createdAt,
        status: resume.status,
        analysis: parsedAnalysis,
        text: textPreview,
      });
    } catch (error: any) {
      console.error("Error fetching resume details:", error);
      return reply.status(500).send({
        error: "Failed to fetch resume details",
        details: error.message,
      });
    }
  });
}
