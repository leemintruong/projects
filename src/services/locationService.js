const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const locationService = {
  async getProvinces() {
    const res = await fetch(`${API_URL}/provinces`);
    return res.json();
  },
  async getDistricts(provinceId) {
    const res = await fetch(`${API_URL}/districts?province_id=${provinceId}`);
    return res.json();
  },
  async getWards(districtId) {
    const res = await fetch(`${API_URL}/wards?district_id=${districtId}`);
    return res.json();
  },
};
