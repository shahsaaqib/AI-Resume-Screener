import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import uploadRoutes from "./modules/upload/upload.route";
import analyzeRoutes from "./modules/analysis/analyze.route";
import listResumeRoutes from "./modules/resume/list.route";
import detailResumeRoutes from "./modules/resume/detail.route";

dotenv.config();

const app = Fastify({ logger: true });
app.register(cors);
app.register(multipart);

// Register routes
app.register(uploadRoutes);
app.register(analyzeRoutes);
app.register(listResumeRoutes);
app.register(detailResumeRoutes);

app.get("/", async () => ({ message: "AI Resume Screener API running 🚀" }));

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
