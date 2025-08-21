import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { register, login, verifyToken } from "./routes/auth";
import { generatePDF, getInvoices } from "./routes/invoice";

dotenv.config();

function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice-generator';
  
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      // For development, create in-memory mock data if MongoDB is not available
      console.log('Running without MongoDB - using mock data for development');
    });

  // Health check endpoint
  app.get("/api/ping", (req, res) => {
    res.json({ message: "Server is running!" });
  });

  // Authentication routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);

  // Protected routes (require authentication)
  app.post("/api/invoice/generate", verifyToken, generatePDF);
  app.get("/api/invoices", verifyToken, getInvoices);

  // Demo endpoint
  app.get("/api/demo", (req, res) => {
    res.json({ 
      message: "Invoice Generator API",
      version: "1.0.0",
      endpoints: [
        "POST /api/auth/register",
        "POST /api/auth/login", 
        "POST /api/invoice/generate",
        "GET /api/invoices"
      ]
    });
  });

  return app;
}

// For development mode with Vite
if (import.meta.env?.DEV) {
  const app = createServer();
  const port = 8080;
  
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export { createServer };
