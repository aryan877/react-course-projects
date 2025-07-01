import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
dotenv.config();

// Import routes
import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import storyRoutes from "./routes/stories.js";

// Import middleware
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Load environment variables
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Security middleware
app.use(helmet());

// Rate limiting - more restrictive for AI API calls
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: Math.ceil(
      (process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000) / 1000
    ),
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Special rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 AI requests per minute
  message: {
    error: "Too many AI requests, please slow down.",
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Compression middleware
app.use(compression());

// Logging middleware
if (NODE_ENV === "development") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("common"));
}

// CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "AI Story Builder Server is running",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    features: {
      openai: !!process.env.OPENAI_API_KEY,
      imageGeneration: process.env.ENABLE_IMAGE_GENERATION === "true",
    },
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/ai", aiLimiter, aiRoutes); // Apply AI rate limiting

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ai-story-builder"
    );
    console.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.info(
    `🚀 AI Story Builder Server running in ${NODE_ENV} mode on port ${PORT}`
  );
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      "⚠️  Warning: OPENAI_API_KEY not found. AI features will not work."
    );
  }
});
