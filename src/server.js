
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcryptjs";

const app = express();
const PORT = 5000;

// ==============================
// Middleware
// ==============================
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: "your_jwt_secret_key", // đổi key này
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ==============================
// MySQL Pool
// ==============================
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "real_estate",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("✅ MySQL Pool sẵn sàng!");


// ==============================
// Auth APIs
// ==============================
app.post("/api/auth/signup", async (req, res) => {
  const { fullName, email, password, role } = req.body;
  if (!fullName || !email || !password) return res.status(400).json({ error: "Missing fields" });

  try {
    const [existing] = await db.query("SELECT id FROM user_profiles WHERE email = ?", [email]);
    if (existing.length) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO user_profiles (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      [fullName, email, hashedPassword, role || "buyer"]
    );

    const user = { id: result.insertId, full_name: fullName, email, role: role || "buyer" };
    req.session.user = user;
    res.json({ user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  try {
    const [rows] = await db.query("SELECT * FROM user_profiles WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    req.session.user = { id: user.id, full_name: user.full_name, email: user.email, role: user.role };
    res.json({ user: req.session.user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/signout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Sign out failed" });
    res.clearCookie('connect.sid');
    res.json({ message: "Signed out" });
  });
});

app.get('/api/auth/me', (req, res) => {
  if (req.session.user) res.json({ user: req.session.user });
  else res.status(401).json({ user: null });
});

// ==============================
// Properties APIs
// ==============================
app.get("/api/properties", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id AS property_id, p.title, p.description, p.property_type, p.status, p.listing_status,
        p.price, p.area, p.bedrooms, p.bathrooms, p.floors, p.address, p.latitude, p.longitude,
        p.featured, p.days_on_market, p.views_count, p.created_at,
        u.id AS owner_id, u.full_name AS owner_name, u.email AS owner_email, u.phone AS owner_phone,
        u.avatar_url AS owner_avatar
      FROM properties p
      JOIN user_profiles u ON p.owner_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Properties AHP với filter & pagination
// ===============================
app.get("/api/properties/ahp", async (req, res) => {
  try {
    const {
      location,
      district,
      propertyType,
      bedrooms,
      bathrooms,
      maxPrice,
      minArea,
      maxArea,
      page = 1,
      limit = 10,
    } = req.query;

    const conditions = [];
    const params = [];

    if (location) {
      conditions.push("p.province_id = ?");
      params.push(parseInt(location));
    }
    if (district) {
      conditions.push("p.district_id = ?");
      params.push(parseInt(district));
    }

    let dbType = null;
    if (propertyType && propertyType !== "all") {
      if (propertyType === "house") dbType = "Nhà phố";
      if (propertyType === "apartment") dbType = "Căn hộ";
      if (propertyType === "villa") dbType = "Biệt thự";
      if (dbType) {
        conditions.push("p.property_type = ?");
        params.push(dbType);
      }
    }

    if (bedrooms) {
      conditions.push("p.bedrooms >= ?");
      params.push(parseInt(bedrooms));
    }
    if (bathrooms) {
      conditions.push("p.bathrooms >= ?");
      params.push(parseInt(bathrooms));
    }
    if (maxPrice) {
      conditions.push("p.price <= ?");
      params.push(parseInt(maxPrice));
    }
    if (minArea) {
      conditions.push("p.area >= ?");
      params.push(parseInt(minArea));
    }
    if (maxArea) {
      conditions.push("p.area <= ?");
      params.push(parseInt(maxArea));
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const offset = (page - 1) * limit;

    const [rows] = await db.query(
      `
      SELECT 
        p.id AS property_id,
        p.title,
        p.property_type,
        p.price,
        p.area,
        p.bedrooms,
        p.bathrooms,
        p.province_id,
        p.district_id
      FROM properties p
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, parseInt(limit), parseInt(offset)]
    );

    if (!rows.length) {
      return res.json({ data: [] });
    }

    // ✅ chuẩn hoá min-max cho tất cả
    const getRange = (arr) => [Math.min(...arr), Math.max(...arr)];
    const [minAreaVal, maxAreaVal] = getRange(rows.map(r => r.area || 0));
    const [minPriceVal, maxPriceVal] = getRange(rows.map(r => r.price || 0));
    const [minBed, maxBed] = getRange(rows.map(r => r.bedrooms || 0));
    const [minBath, maxBath] = getRange(rows.map(r => r.bathrooms || 0));

    const safeNorm = (val, min, max, invert = false) => {
      if (!val || max === min) return 0;
      return invert
        ? (max - val) / (max - min) * 100
        : (val - min) / (max - min) * 100;
    };

    // Trọng số mặc định
    const weights = [0.25, 0.2, 0.15, 0.2, 0.1, 0.1];

    // Chuẩn hoá loại BĐS theo map
    const typeScore = {
      "Căn hộ": 70,
      "Nhà phố": 85,
      "Biệt thự": 100,
      "default": 60
    };

    const data = rows.map((p) => {
      // Vị trí (tạm: nếu cùng tỉnh = 100, khác tỉnh = 60 → có thể cải tiến bằng khoảng cách GPS)
      const c1 = location ? (p.province_id == location ? 100 : 60) : 60;
      // Diện tích
      const c2 = safeNorm(p.area, minAreaVal, maxAreaVal);
      // Loại
      const c3 = typeScore[p.property_type] || typeScore["default"];
      // Giá
      const c4 = safeNorm(p.price, minPriceVal, maxPriceVal, true);
      // Phòng ngủ
      const c5 = safeNorm(p.bedrooms, minBed, maxBed);
      // Phòng tắm
      const c6 = safeNorm(p.bathrooms, minBath, maxBath);

      const total = (
        c1 * weights[0] +
        c2 * weights[1] +
        c3 * weights[2] +
        c4 * weights[3] +
        c5 * weights[4] +
        c6 * weights[5]
      ).toFixed(2);

      return {
        property_id: p.property_id,
        title: p.title,
        c1: c1.toFixed(2),
        c2: c2.toFixed(2),
        c3: c3.toFixed(2),
        c4: c4.toFixed(2),
        c5: c5.toFixed(2),
        c6: c6.toFixed(2),
        total_score: total.toFixed(2),
        total_raw: total,
      };
    });
    data.sort((a, b) => b.total_raw - a.total_raw);

// bỏ total_raw trước khi trả về
const result = data.map(({ total_raw, ...rest }) => rest);

    res.json({ data: result });
  } catch (err) {
    console.error("❌ Error /api/properties/ahp:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/properties/ahp/:id", async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    if (!propertyId) return res.status(400).json({ error: "Invalid property id" });

    const {
      location,
      district,
      propertyType,
      bedrooms,
      bathrooms,
      maxPrice,
      minArea,
      maxArea,
    } = req.query;

    // map loại BĐS từ FE sang DB
    let dbType = null;
    if (propertyType && propertyType !== "all") {
      if (propertyType === "house") dbType = "Nhà phố";
      if (propertyType === "apartment") dbType = "Căn hộ";
      if (propertyType === "villa") dbType = "Biệt thự";
    }

    // lấy property theo id
    const [rows] = await db.query(`
      SELECT id, title, property_type, price, area, bedrooms, bathrooms, province_id, district_id
      FROM properties
      WHERE id = ?
    `, [propertyId]);

    if (!rows.length) return res.status(404).json({ error: "Property not found" });
    const p = rows[0];

    // lấy toàn bộ dataset (có filter) để tính min–max normalization
    const conditions = [];
    const params = [];

    if (location) {
      conditions.push("province_id = ?");
      params.push(parseInt(location));
    }
    if (district) {
      conditions.push("district_id = ?");
      params.push(parseInt(district));
    }
    if (dbType) {
      conditions.push("property_type = ?");
      params.push(dbType);
    }
    if (bedrooms) {
      conditions.push("bedrooms >= ?");
      params.push(parseInt(bedrooms));
    }
    if (bathrooms) {
      conditions.push("bathrooms >= ?");
      params.push(parseInt(bathrooms));
    }
    if (maxPrice) {
      conditions.push("price <= ?");
      params.push(parseInt(maxPrice));
    }
    if (minArea) {
      conditions.push("area >= ?");
      params.push(parseInt(minArea));
    }
    if (maxArea) {
      conditions.push("area <= ?");
      params.push(parseInt(maxArea));
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [allProps] = await db.query(`
      SELECT price, area, bedrooms, bathrooms
      FROM properties
      ${whereClause}
    `, params);

    if (!allProps.length) return res.json({ error: "No dataset for normalization" });

    // tính min–max
    const getRange = (arr) => [Math.min(...arr), Math.max(...arr)];
    const [minAreaVal, maxAreaVal] = getRange(allProps.map(x => x.area || 0));
    const [minPriceVal, maxPriceVal] = getRange(allProps.map(x => x.price || 0));
    const [minBed, maxBed] = getRange(allProps.map(x => x.bedrooms || 0));
    const [minBath, maxBath] = getRange(allProps.map(x => x.bathrooms || 0));

    const safeNorm = (val, min, max, invert = false) => {
      if (max === min) return 0;
      return invert
        ? (max - val) / (max - min)
        : (val - min) / (max - min);
    };

    // trọng số cố định (bạn có thể đổi)
    const weights = [0.25, 0.2, 0.15, 0.2, 0.1, 0.1];

    // Tính C1–C6
    let c1 = 60;
    if (location && p.province_id == location) c1 = 100;
    if (district && p.district_id == district) c1 = 100;

    const c2 = safeNorm(p.area || 0, minAreaVal, maxAreaVal) * 100;

    let c3 = 70;
    if (p.property_type === "Nhà phố") c3 = 80;
    if (p.property_type === "Căn hộ") c3 = 70;
    if (p.property_type === "Biệt thự") c3 = 100;

    const c4 = safeNorm(p.price || 0, minPriceVal, maxPriceVal, true) * 100;
    const c5 = safeNorm(p.bedrooms || 0, minBed, maxBed) * 100;
    const c6 = safeNorm(p.bathrooms || 0, minBath, maxBath) * 100;

    const arr = [c1, c2, c3, c4, c5, c6];
    const scores = arr.map((v, i) => v * weights[i]);
    const total = scores.reduce((a, b) => a + b, 0);

    res.json({
      property_id: p.id,
      title: p.title,
      c1: c1.toFixed(2),
      c2: c2.toFixed(2),
      c3: c3.toFixed(2),
      c4: c4.toFixed(2),
      c5: c5.toFixed(2),
      c6: c6.toFixed(2),
      total_score: total.toFixed(2),
      weights
    });
  } catch (err) {
    console.error("❌ Error /properties/ahp/:id:", err);
    res.status(500).json({ error: err.message });
  }
});




app.get("/api/properties/:id", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id AS property_id, p.title, p.description, p.property_type, p.status, p.listing_status,
        p.price, p.area, p.bedrooms, p.bathrooms, p.floors, p.address, p.latitude, p.longitude,
        p.featured, p.days_on_market, p.views_count, p.created_at,
        u.id AS owner_id, u.full_name AS owner_name, u.email AS owner_email, u.phone AS owner_phone,
        u.avatar_url AS owner_avatar
      FROM properties p
      JOIN user_profiles u ON p.owner_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (!rows.length) return res.status(404).json({ message: "Property not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/properties/featured", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id AS property_id, p.title, p.description, p.property_type, p.price,
        u.id AS owner_id, u.full_name AS owner_name
      FROM properties p
      JOIN user_profiles u ON p.owner_id = u.id
      WHERE p.featured = TRUE
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// Agents APIs
// ==============================
app.get("/api/agents", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id AS seller_id, full_name, email, phone, avatar_url, bio, is_verified, created_at
      FROM user_profiles
      WHERE role = 'seller' AND is_active = TRUE
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/agents/:id", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id AS seller_id, full_name, email, phone, avatar_url, bio, is_verified, created_at
      FROM user_profiles
      WHERE role = 'seller' AND is_active = TRUE AND id = ?
    `, [req.params.id]);

    if (!rows.length) return res.status(404).json({ message: "Seller not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// Locations APIs
// ==============================
app.get("/api/provinces", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT id, name FROM provinces ORDER BY name`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/districts", async (req, res) => {
  const { province_id } = req.query;
  if (!province_id) return res.status(400).json({ error: "province_id is required" });

  try {
    const [rows] = await db.query(`SELECT id, name, province_id FROM districts WHERE province_id = ? ORDER BY name`, [province_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/wards", async (req, res) => {
  const { district_id } = req.query;
  if (!district_id) return res.status(400).json({ error: "district_id is required" });

  try {
    const [rows] = await db.query(`SELECT id, name, district_id FROM wards WHERE district_id = ? ORDER BY name`, [district_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// Favorites APIs
// ==============================
app.get("/api/favorites/:user_id", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.id, f.property_id, f.created_at, p.title, p.price
      FROM favorites f
      JOIN properties p ON f.property_id = p.id
      WHERE f.user_id = ?
    `, [req.params.user_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/favorites", async (req, res) => {
  const { user_id, property_id } = req.body;
  if (!user_id || !property_id) return res.status(400).json({ error: "Missing fields" });

  try {
    await db.query("INSERT INTO favorites (user_id, property_id) VALUES (?, ?)", [user_id, property_id]);
    res.json({ message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/favorites", async (req, res) => {
  const { user_id, property_id } = req.body;
  if (!user_id || !property_id) return res.status(400).json({ error: "Missing fields" });

  try {
    await db.query("DELETE FROM favorites WHERE user_id = ? AND property_id = ?", [user_id, property_id]);
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==============================
// Start server
// ==============================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
