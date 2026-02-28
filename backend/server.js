
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import staff from "./routes/staff.route.js";
import student from "./routes/student.route.js";
import maintenance from "./routes/maintenance.route.js";

await connectDB();
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:8080",
        "http://localhost:5173",
        "https://opticampus-nine.vercel.app/",
      ];

    
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
  

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/staff", staff);
app.use("/api/student", student);
app.use("/api/maintenance", maintenance);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello Opticampus");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
