import express, { Request, Response } from "express";
import verifyToken from "../middleware/authMiddel";
import prisma from "../prisma";


const router = express.Router();

interface AuthenticatedRequest extends Request {
  email?: string;
}

const parseTitle = (title: string) => {
  try {
    const parsed = JSON.parse(title);
    if (!parsed.en || !parsed.ar || !parsed.fr) {
      throw new Error("Title must contain all languages (en, ar, fr)");
    }
    return parsed;
  } catch (error) {
    throw new Error("Invalid title format. Expected JSON with en, ar, fr properties");
  }
};

router.post("/add-video", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.email) return res.status(401).json({ message: "Unauthorized" });

    const title = parseTitle(req.body.title);
    const youtubeLink = req.body.youtubeLink;

    if (!youtubeLink) return res.status(400).json({ message: "YouTube link is required" });

    const newVideo = await prisma.video.create({
      data: {
        title: title as Record<string, string>,
        youtubeLink,
        user: { connect: { email: req.email } }
      }
    });

    res.status(201).json({ message: "Video added successfully", video: newVideo });
  } catch (error) {
    const message = (error as Error).message;
    res.status(message.includes("JSON") ? 400 : 500).json({ message });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const allVideos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ videos: allVideos });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get("/my-videos", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.email) return res.status(401).json({ message: "Unauthorized" });
    
    const videos = await prisma.video.findMany({
      where: { userEmail: req.email },
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ videos });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid video ID" });

    const video = await prisma.video.findUnique({
      where: { id }
    });

    if (!video) return res.status(404).json({ message: "Video not found" });
    res.status(200).json({ video });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.put("/update-video/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.email) return res.status(401).json({ message: "Unauthorized" });

    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });

    const existingVideo = await prisma.video.findUnique({
      where: { id }
    });

    if (!existingVideo) return res.status(404).json({ message: "Video not found" });
    if (existingVideo.userEmail !== req.email) return res.status(403).json({ message: "Forbidden" });

    const updatedData: {
      title?: Record<string, string>;
      youtubeLink?: string;
    } = {};

    if (req.body.title) updatedData.title = parseTitle(req.body.title) as Record<string, string>;
    if (req.body.youtubeLink) updatedData.youtubeLink = req.body.youtubeLink;

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: updatedData
    });

    res.status(200).json({ message: "Video updated", video: updatedVideo });
  } catch (error) {
    const message = (error as Error).message;
    res.status(message.includes("JSON") ? 400 : 500).json({ message });
  }
});

router.delete("/delete-video/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.email) return res.status(401).json({ message: "Unauthorized" });

    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });

    const existingVideo = await prisma.video.findUnique({
      where: { id }
    });

    if (!existingVideo) return res.status(404).json({ message: "Video not found" });
    if (existingVideo.userEmail !== req.email) return res.status(403).json({ message: "Forbidden" });

    await prisma.video.delete({
      where: { id }
    });

    res.status(200).json({ message: "Video deleted" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;

