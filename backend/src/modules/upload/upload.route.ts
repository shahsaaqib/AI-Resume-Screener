import { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";
import { PDFExtract, PDFExtractOptions } from "pdf.js-extract";
import prisma from "../../lib/prisma";

/**
 * Handles PDF uploads, extracts text using pdf.js-extract,
 * and stores filename + extracted text in PostgreSQL.
 */
export default async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", async (req, reply) => {
    try {
      const data = await req.file(); // multipart form file
      if (!data) {
        return reply.status(400).send({ error: "No file uploaded" });
      }

      // Ensure uploads directory exists
      const uploadDir = path.join(__dirname, "../../../uploads");
      await fs.promises.mkdir(uploadDir, { recursive: true });

      // Save uploaded file temporarily
      const tempPath = path.join(uploadDir, data.filename);
      const fileBuffer = await data.toBuffer();
      await fs.promises.writeFile(tempPath, fileBuffer);

      // Extract text using pdf.js-extract
      const pdfExtract = new PDFExtract();
      const options: PDFExtractOptions = {}; // default options
      const pdfData = await pdfExtract.extractBuffer(fileBuffer, options);

      // Combine all pages' text
      const text = pdfData.pages
        .map((page) => page.content.map((c) => c.str).join(" "))
        .join("\n");

      if (!text || text.trim().length === 0) {
        await fs.promises.unlink(tempPath);
        return reply
          .status(422)
          .send({ error: "Could not extract text from the uploaded PDF" });
      }

      // Save to database
      const resume = await prisma.resume.create({
        data: {
          filename: data.filename,
          text,
          status: "pending",
        },
      });

      // Cleanup temporary file
      await fs.promises.unlink(tempPath);

      // Respond success
      return reply.status(201).send({
        message: "Resume uploaded and processed successfully",
        id: resume.id,
        filename: data.filename,
        textPreview: text.substring(0, 300) + "...",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      return reply.status(500).send({
        error: "Failed to process PDF",
        details: error.message,
      });
    }
  });
}
