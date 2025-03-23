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
    const partnerships = await prisma.partnership.findMany({
      select: {
        id: true,
        websiteUrl: true,
        image: true
      }
    });
    res.status(200).json({ partnerships });
  } catch (error) {
    console.error("Error fetching partnerships:", error);
    res.status(500).json({ message: "Failed to fetch partnerships" });
  }
});

router.post(
  "/add-partner",
  verifyToken,
  upload.single("image"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { websiteUrl } = req.body;
      const email = req.email;

      if (!websiteUrl || !req.file || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const imageBase64 = req.file.buffer.toString("base64");

      const newPartner = await prisma.partnership.create({
        data: {
          websiteUrl,
          image: imageBase64,
          user: { connect: { email } }
        }
      });

      res.status(201).json({ message: "Partner added successfully", newPartner });
    } catch (error) {
      console.error("Error adding partner:", error);
      res.status(500).json({ message: "Failed to add partner" });
    }
  }
);

router.get("/my-partners", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const email = req.email;
    if (!email) return res.status(401).json({ message: "Unauthorized" });

    const partners = await prisma.partnership.findMany({
      where: { userEmail: email }
    });
    res.status(200).json({ partners });
  } catch (error) {
    console.error("Error retrieving partners:", error);
    res.status(500).json({ message: "Failed to retrieve partners" });
  }
});

router.put(
  "/update-partner/:id",
  verifyToken,
  upload.single("image"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { websiteUrl } = req.body;
      const email = req.email;

      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });
      if (!email) return res.status(401).json({ message: "Unauthorized" });

      const partner = await prisma.partnership.findUnique({
        where: { id }
      });

      if (!partner) return res.status(404).json({ message: "Partner not found" });
      if (partner.userEmail !== email) return res.status(403).json({ message: "Unauthorized" });

      const updatedPartner = await prisma.partnership.update({
        where: { id },
        data: {
          websiteUrl: websiteUrl || partner.websiteUrl,
          image: req.file ? req.file.buffer.toString("base64") : partner.image
        }
      });

      res.status(200).json({ message: "Partner updated successfully", partner: updatedPartner });
    } catch (error) {
      console.error("Error updating partner:", error);
      res.status(500).json({ message: "Failed to update partner" });
    }
  }
);

router.delete("/delete-partner/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const email = req.email;

    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });
    if (!email) return res.status(401).json({ message: "Unauthorized" });

    const partner = await prisma.partnership.findUnique({
      where: { id }
    });

    if (!partner) return res.status(404).json({ message: "Partner not found" });
    if (partner.userEmail !== email) return res.status(403).json({ message: "Unauthorized" });

    await prisma.partnership.delete({
      where: { id }
    });

    res.status(200).json({ message: "Partner deleted successfully" });
  } catch (error) {
    console.error("Error deleting partner:", error);
    res.status(500).json({ message: "Failed to delete partner" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });

    const partner = await prisma.partnership.findUnique({
      where: { id },
      select: {
        id: true,
        websiteUrl: true,
        image: true
      }
    });

    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.status(200).json({ partner });
  } catch (error) {
    console.error("Error fetching partner:", error);
    res.status(500).json({ message: "Failed to fetch partner" });
  }
});

export default router;






