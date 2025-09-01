import express from "express";
import {
  createNote,
  getNotes,
  deleteNote,
} from "../controllers/noteController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected by JWT
router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getNotes);
router.delete("/:id", authMiddleware, deleteNote);

export default router;
