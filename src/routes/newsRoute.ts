import express, { Request, Response } from "express";
import multer from "multer";
import verifyToken from "../middleware/authMiddel";
import prisma from "../prisma";


const router = express.Router();

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

router.post("/adding-news", verifyToken, upload.single("image"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.email) return res.status(401).json({ message: "Unauthorized" });

    const title = parseMultilingualField(req.body.title, "title");
    const paragraph = parseMultilingualField(req.body.paragraph, "paragraph");

    if (!title.en || !title.ar || !title.fr) {
      return res.status(400).json({ message: "Title required in all languages" });
    }
    if (!paragraph.en || !paragraph.ar || !paragraph.fr) {
      return res.status(400).json({ message: "Paragraph required in all languages" });
    }

    const image = req.file ? req.file.buffer.toString("base64") : null;
    const youtubeLink = req.body.youtubeLink || null;
    const isFeatured = req.body.isFeatured === 'true';

    if (!image && !youtubeLink) {
      return res.status(400).json({ message: "Media required (image or YouTube)" });
    }

    const newNews = await prisma.news.create({
      data: {
        title: title as Record<string, string>,
        paragraph: paragraph as Record<string, string>,
        image,
        youtubeLink,
        isFeatured,
        user: { connect: { email: req.email } }
      }
    });

    res.status(201).json({ message: "News added successfully", news: newNews });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get("/featured-news", async (req: Request, res: Response) => {
  try {
    const featuredNews = await prisma.news.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 3
    });
    res.status(200).json({ news: featuredNews });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const allNews = await prisma.news.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ news: allNews });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get("/my-news", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.email) return res.status(401).json({ message: "Unauthorized" });
    
    const news = await prisma.news.findMany({
      where: { userEmail: req.email },
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ news });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid news ID format" });

    const news = await prisma.news.findUnique({
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

    if (!news) return res.status(404).json({ message: "News article not found" });
    if (!news.image && !news.youtubeLink) {
      console.warn(`News ${id} has no media attached`);
    }

    res.status(200).json({ news });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ 
      message: "Failed to fetch news article",
      error: (error as Error).message
    });
  }
});

router.put("/update-news/:id", verifyToken, upload.single("image"), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.email) return res.status(401).json({ message: "Unauthorized" });

    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "News article not found" });
    if (existing.userEmail !== req.email) return res.status(403).json({ message: "Forbidden" });

    const title = req.body.title ? parseMultilingualField(req.body.title, "title") : existing.title;
    const paragraph = req.body.paragraph ? parseMultilingualField(req.body.paragraph, "paragraph") : existing.paragraph;
    const image = req.file ? req.file.buffer.toString("base64") : existing.image;
    const youtubeLink = req.body.youtubeLink || existing.youtubeLink;
    const isFeatured = req.body.isFeatured === 'true';

    if (!image && !youtubeLink) {
      return res.status(400).json({ message: "Media required (image/YouTube)" });
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title: title as Record<string, string>,
        paragraph: paragraph as Record<string, string>,
        image,
        youtubeLink,
        isFeatured
      }
    });

    res.status(200).json({ message: "News updated successfully", news: updatedNews });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.delete("/delete-news/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.email) return res.status(401).json({ message: "Unauthorized" });

    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "News article not found" });
    if (existing.userEmail !== req.email) return res.status(403).json({ message: "Forbidden" });

    await prisma.news.delete({ where: { id } });
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;












 
 
 
 
 
 
 