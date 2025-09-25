// import React from "react";
// import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
// import ScrollToTop from "./components/ScrollToTop";
// import ErrorBoundary from "./components/ErrorBoundary";

// // Page imports
// import Homepage from "./pages/homepage";
// import PropertyListings from "./pages/property-listings";
// import PropertyDetails from "./pages/property-details";
// import NotFound from "./pages/NotFound";

// const Routes = () => {
//   return (
//     <BrowserRouter>
//       <ErrorBoundary>
//         <ScrollToTop />
//         <RouterRoutes>
//           <Route path="/" element={<Homepage />} />
//           <Route path="/property-listings" element={<PropertyListings />} />
//           <Route path="/property-details/:id" element={<PropertyDetails />} />
//           <Route path="*" element={<NotFound />} />
//         </RouterRoutes>
//       </ErrorBoundary>
//     </BrowserRouter>
//   );
// };

// export default Routes;
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

// Featured properties
router.get("/featured", async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  try {
    const [rows] = await db.query(
      `SELECT p.*, pi.image_url, pi.alt_text, pi.is_primary,
              u.full_name AS agent_name, u.avatar_url AS agent_avatar,
              pr.name AS province_name, d.name AS district_name
       FROM properties p
       LEFT JOIN property_images pi ON pi.property_id = p.id AND pi.is_primary = 1
       LEFT JOIN user_profiles u ON u.id = p.owner_id
       LEFT JOIN provinces pr ON pr.id = p.province_id
       LEFT JOIN districts d ON d.id = p.district_id
       WHERE p.featured = 1 AND p.listing_status = 'active'
       ORDER BY p.created_at DESC
       LIMIT ?`,
      [limit]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
