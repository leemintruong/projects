const API_URL = "http://localhost:5000/api"; // URL backend của bạn

const propertyService = {
  // Lấy tất cả properties
  getAllProperties: async () => {
    try {
      const res = await fetch(`${API_URL}/properties`);
      if (!res.ok) throw new Error("Lỗi khi lấy danh sách properties");
      const data = await res.json();
      return data; // trả về mảng
    } catch (error) {
      console.error("getAllProperties error:", error);
      return []; // nếu lỗi trả về mảng rỗng
    }
  },

  // Lấy property theo ID
  getPropertyById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/properties/${id}`);
      if (!res.ok) throw new Error("Property not found");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("getPropertyById error:", error);
      return null;
    }
  },

  // Lấy các properties featured
  getFeaturedProperties: async () => {
    try {
      const res = await fetch(`${API_URL}/properties/featured`);
      if (!res.ok) throw new Error("Featured properties not found");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("getFeaturedProperties error:", error);
      return []; // trả về mảng rỗng nếu lỗi
    }
  },
};

export default propertyService;
