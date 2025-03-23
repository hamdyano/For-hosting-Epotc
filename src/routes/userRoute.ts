import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma";


const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString().notEmpty(),
    check("lastName", "Last Name is required").isString().notEmpty(),
    check("email", "Email is required").isEmail(),
    check("city", "City is required").isString().notEmpty(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { firstName, lastName, email, city, password } = req.body;

    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 8);

      // Create new user
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          city,
          password: hashedPassword,
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.status(201).json({
        message: "User registered successfully",
        userId: user.id,
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;



