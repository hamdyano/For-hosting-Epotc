import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extended type declarations
declare global {
  namespace Express {
    interface Request {
      userId?: number;  // Changed to numeric ID
      email?: string;
    }
  }
}

interface JwtPayload {
  userId: number;      // Numeric ID type
  email: string;
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.auth_token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    
    // Validate numeric ID format
    if (typeof decoded.userId !== 'number') {
      throw new Error("Invalid user ID format in token");
    }

    req.userId = decoded.userId;
    req.email = decoded.email;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    
    // Special handling for numeric ID mismatch
    const errorMessage = error instanceof Error && error.message.includes("ID format") 
      ? "Invalid authentication token format"
      : "Unauthorized: Invalid token";

    res.status(401).json({ message: errorMessage });
  }
};

export default verifyToken;







