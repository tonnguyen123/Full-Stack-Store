import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // Serve static files correctly
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL; // Use local DB if no MONGO_URL is set

// Connect to MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("DB connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch(error => console.log("MongoDB connection error:", error));

// Routes
app.use("/api", route);
