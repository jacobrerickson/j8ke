import { Router } from "express";

const router = Router();

// URL shortening redirect endpoint
router.get("/s/:shortCode", (req, res) => {
  const shortCode = req.params.shortCode;

  // Use an IIFE to handle async logic
  void (async () => {
    try {
      // Import the model here to avoid circular dependencies
      const { UrlMappingModel } = await import("../models/url-mapping");

      const mapping = await UrlMappingModel.findOne({ shortCode });

      if (mapping) {
        // Increment click count and update last accessed time
        await UrlMappingModel.findOneAndUpdate(
          { shortCode },
          {
            $inc: { clickCount: 1 },
            $set: { lastAccessedAt: new Date() },
          },
        );

        // Redirect to the original URL
        res.redirect(301, mapping.originalUrl);
        return;
      }

      // Short code not found
      res.status(404).json({ error: "Short URL not found" });
    } catch (error) {
      console.error("Error handling short URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  })();
});

export { router as urlShortenerRouter };
