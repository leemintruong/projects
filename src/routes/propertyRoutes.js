import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Kết nối MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ===== Featured properties =====
router.get('/featured', async (req, res) => {
  try {
    // Lấy limit từ query string, mặc định = 6
    const limit = parseInt(req.query.limit, 10) || 6;

    const [rows] = await db.query(
      `SELECT p.*, 
              pi.image_url, pi.alt_text, pi.is_primary, 
              u.full_name AS agent_name, u.avatar_url AS agent_avatar, 
              pr.name AS province_name, d.name AS district_name
       FROM properties p
       LEFT JOIN property_images pi ON pi.property_id = p.id AND pi.is_primary = 1
       LEFT JOIN user_profiles u ON u.id = p.owner_id
       LEFT JOIN provinces pr ON pr.id = p.province_id
       LEFT JOIN districts d ON d.id = p.district_id
       WHERE p.featured = 1 AND p.listing_status = 'active'
       LIMIT ?`,
      [limit]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching featured properties:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
