import { FastifyInstance } from "fastify";
import prisma from "../../lib/prisma";

export default async function listResumeRoutes(app: FastifyInstance) {
  app.get("/resumes", async (req, reply) => {
    try {
      const resumes = await prisma.resume.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          filename: true,
          createdAt: true,
          status: true,
          analysis: true,
        },
      });

      const result = resumes.map((r) => ({
        id: r.id,
        filename: r.filename,
        createdAt: r.createdAt,
        status: r.status,
        analysis: r.analysis ?? null,
      }));

      return reply.status(200).send({
        count: result.length,
        resumes: result,
      });
    } catch (error: any) {
      console.error("Error fetching resumes:", error);
      return reply.status(500).send({
        error: "Failed to fetch resumes",
        details: error.message,
      });
    }
  });
}
