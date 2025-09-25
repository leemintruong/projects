// routes/favoriteRoutes.js
import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Lấy tất cả favorites của user
router.get("/:user_id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT f.id AS favorite_id, f.property_id, p.*
       FROM favorites f
       JOIN properties p ON p.id = f.property_id
       WHERE f.user_id = ?`,
      [req.params.user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Thêm property vào favorites
router.post("/", async (req, res) => {
  const { user_id, property_id } = req.body;
  if (!user_id || !property_id) {
    return res.status(400).json({ success: false, error: "user_id and property_id required" });
  }
  try {
    await db.query(
      `INSERT INTO favorites (user_id, property_id) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP`,
      [user_id, property_id]
    );
    res.json({ success: true, message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Xóa property khỏi favorites
router.delete("/", async (req, res) => {
  const { user_id, property_id } = req.body;
  if (!user_id || !property_id) {
    return res.status(400).json({ success: false, error: "user_id and property_id required" });
  }
  try {
    await db.query(
      `DELETE FROM favorites WHERE user_id = ? AND property_id = ?`,
      [user_id, property_id]
    );
    res.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Kiểm tra 1 property có trong favorites của user chưa
router.get("/check/:user_id/:property_id", async (req, res) => {
  const { user_id, property_id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT 1 FROM favorites WHERE user_id = ? AND property_id = ? LIMIT 1`,
      [user_id, property_id]
    );
    res.json({ success: true, isFavorite: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
    