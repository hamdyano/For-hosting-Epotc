import express , {Request,Response}from "express";
import cors from "cors";
import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";
import newsRoute from "./routes/newsRoute";
import cookieParser from "cookie-parser";
import partnershipRoute from "./routes/partnershipRoute";
import photosRoute from "./routes/photosRoute";
import path from "path";
import videosRoute from "./routes/videosRoute";
import homeRoute from "./routes/homeRoute";




const prisma = new PrismaClient();
const app = express();







app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


 
// CORS
 app.use(
  cors({
      origin: "http://localhost:5173", // Allow frontend origin
      credentials: true, // Allow cookies and credentials
      methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);




app.use("/api/auth", authRoute);
app.use("/api/users",userRoute)
app.use("/api/user-profile",authRoute)
app.use("/api/user-update",authRoute)
app.use("/api/news",newsRoute)
app.use("/api/partner",partnershipRoute)
app.use("/api/allphotos",photosRoute)
app.use("/api/videos",videosRoute)
app.use("/api/home",homeRoute)



app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});



app.get("/health", async( req:Request,res:Response) => {
res.send({message:" healh ok "})
})


async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database via Prisma');
    await prisma.$disconnect();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

checkDatabaseConnection();

app.listen(9000, ()=> {
    console.log("server started on localhost :9000");
});








/*
app.use(
    session({
      secret: process.env.JWT_SECRET_KEY || "fallback_secret", // Load secret from .env
      resave: false,
      saveUninitialized: true,
      cookie: {
        sameSite: "none", 
        secure: true, // Required for SameSite="none" (must be HTTPS)
        httpOnly: true, // Prevent JavaScript access to cookies
      },
    })
  );*/
