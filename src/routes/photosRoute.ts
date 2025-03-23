import express, { Request, Response } from "express";
import verifyToken from "../middleware/authMiddel";
import multer from "multer";
import prisma from "../prisma";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

interface AuthenticatedRequest extends Request {
  email?: string;
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const photos = await prisma.photo.findMany({
      select: {
        id: true,
        image: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ photos });
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ message: "Failed to fetch photos" });
  }
});

router.post(
  "/add-photo",
  verifyToken,
  upload.single("image"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const email = req.email;
      if (!email || !req.file) {
        return res.status(400).json({ message: "Missing required data" });
      }

      const imageBase64 = req.file.buffer.toString("base64");

      const newPhoto = await prisma.photo.create({
        data: {
          image: imageBase64,
          user: { connect: { email } }
        }
      });

      res.status(201).json({ 
        message: "Photo uploaded successfully",
        newPhoto: {
          id: newPhoto.id,
          image: newPhoto.image,
          createdAt: newPhoto.createdAt
        }
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ message: "Failed to upload photo" });
    }
  }
);

router.get("/my-photos", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const email = req.email;
    if (!email) return res.status(401).json({ message: "Unauthorized" });

    const photos = await prisma.photo.findMany({
      where: { userEmail: email },
      select: {
        id: true,
        image: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ photos });
  } catch (error) {
    console.error("Error retrieving photos:", error);
    res.status(500).json({ message: "Failed to retrieve photos" });
  }
});

router.put(
  "/update-photo/:id",
  verifyToken,
  upload.single("image"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const email = req.email;
      
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });
      if (!email) return res.status(401).json({ message: "Unauthorized" });

      const existingPhoto = await prisma.photo.findUnique({
        where: { id }
      });

      if (!existingPhoto) return res.status(404).json({ message: "Photo not found" });
      if (existingPhoto.userEmail !== email) return res.status(403).json({ message: "Unauthorized" });

      const updatedPhoto = await prisma.photo.update({
        where: { id },
        data: {
          image: req.file ? req.file.buffer.toString("base64") : existingPhoto.image
        }
      });

      res.status(200).json({ 
        message: "Photo updated successfully",
        photo: {
          id: updatedPhoto.id,
          image: updatedPhoto.image,
          createdAt: updatedPhoto.createdAt
        }
      });
    } catch (error) {
      console.error("Error updating photo:", error);
      res.status(500).json({ message: "Failed to update photo" });
    }
  }
);

router.delete("/delete-photo/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const email = req.email;

    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });
    if (!email) return res.status(401).json({ message: "Unauthorized" });

    const existingPhoto = await prisma.photo.findUnique({
      where: { id }
    });

    if (!existingPhoto) return res.status(404).json({ message: "Photo not found" });
    if (existingPhoto.userEmail !== email) return res.status(403).json({ message: "Unauthorized" });

    await prisma.photo.delete({
      where: { id }
    });

    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ message: "Failed to delete photo" });
  }
});

export default router;




