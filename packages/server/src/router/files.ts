import { Router } from "express";
import { existsSync } from "fs";
import path from "path";

const router = Router();

// File download endpoint
router.get("/api/files/download/:filename", (req, res) => {
  const filename = req.params.filename;

  // First check in processed directory
  const processedPath = path.join(process.cwd(), "processed", filename);
  const uploadsPath = path.join(process.cwd(), "uploads", filename);

  let filePath: string | null = null;

  if (existsSync(processedPath)) {
    filePath = processedPath;
  } else if (existsSync(uploadsPath)) {
    filePath = uploadsPath;
  }

  if (filePath) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

export { router as filesRouter };
