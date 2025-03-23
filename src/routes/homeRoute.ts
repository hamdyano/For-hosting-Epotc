import express, { Request, Response } from "express";
import multer from "multer";
import verifyToken from "../middleware/authMiddel";
import prisma from "../prisma";


const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

interface AuthenticatedRequest extends Request {
  email?: string;
}

const parseMultilingualField = (field: string, fieldName: string) => {
  try {
    return JSON.parse(field);
  } catch (error) {
    throw new Error(`Invalid format for ${fieldName}. Expected JSON.`);
  }
};

// Create new topic
router.post("/adding-topic", verifyToken, upload.single("image"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.email) return res.status(401).json({ message: "Unauthorized" });

    const title = parseMultilingualField(req.body.title, "title");
    const paragraph = parseMultilingualField(req.body.paragraph, "paragraph");

    // Validate required fields
    if (!title.en || !title.ar || !title.fr) {
      return res.status(400).json({ message: "Title required in all languages" });
    }
    if (!paragraph.en || !paragraph.ar || !paragraph.fr) {
      return res.status(400).json({ message: "Paragraph required in all languages" });
    }

    const image = req.file ? req.file.buffer.toString("base64") : null;
    const youtubeLink = req.body.youtubeLink || null;

    if (!image && !youtubeLink) {
      return res.status(400).json({ message: "Media required (image or YouTube)" });
    }

    const newTopic = await prisma.topic.create({
      data: {
        title: title as Record<string, string>,
        paragraph: paragraph as Record<string, string>,
        image,
        youtubeLink,
        user: { connect: { email: req.email } }
      }
    });

    res.status(201).json({ message: "Topic created", topic: newTopic });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get all topics
router.get("/", async (req: Request, res: Response) => {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true } } } // Added closing bracket here
    });
    res.status(200).json({ topics });
  } catch (error) {
    console.error("Fetch topics error:", error);
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get user's topics
router.get("/my-topics", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.email) return res.status(401).json({ message: "Unauthorized" });
    
    const topics = await prisma.topic.findMany({
      where: { userEmail: req.email },
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ topics });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get single topic
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const topic = await prisma.topic.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        paragraph: true,
        image: true,
        youtubeLink: true,
        userEmail: true
      }
    });

    if (!topic) return res.status(404).json({ message: "Topic not found" });

    res.status(200).json({ topic });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
});

// Update topic
router.put("/update-topic/:id", verifyToken, upload.single("image"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.email) return res.status(401).json({ message: "Unauthorized" });

    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });

    const existing = await prisma.topic.findUnique({
      where: { id },
    });

    if (!existing) return res.status(404).json({ message: "Topic not found" });
    if (existing.userEmail !== req.email) {
      return res.status(403).json({ message: "Can only edit own topics" });
    }

    const title = req.body.title ? parseMultilingualField(req.body.title, "title") : existing.title;
    const paragraph = req.body.paragraph ? parseMultilingualField(req.body.paragraph, "paragraph") : existing.paragraph;
    const image = req.file ? req.file.buffer.toString("base64") : existing.image;
    const youtubeLink = req.body.youtubeLink || existing.youtubeLink;

    if (!image && !youtubeLink) {
      return res.status(400).json({ message: "Media required (image/YouTube)" });
    }

    const updatedTopic = await prisma.topic.update({
      where: { id },
      data: {
        title: title as Record<string, string>,
        paragraph: paragraph as Record<string, string>,
        image,
        youtubeLink
      }
    });

    res.status(200).json({ message: "Topic updated", topic: updatedTopic });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Delete topic
router.delete("/delete-topic/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.email) return res.status(401).json({ message: "Unauthorized" });

    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });

    const existing = await prisma.topic.findUnique({
      where: { id },
    });

    if (!existing) return res.status(404).json({ message: "Topic not found" });
    if (existing.userEmail !== req.email) {
      return res.status(403).json({ message: "Can only delete own topics" });
    }

    await prisma.topic.delete({
      where: { id }
    });

    res.status(200).json({ message: "Topic deleted" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;





