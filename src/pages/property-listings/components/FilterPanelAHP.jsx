import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";

const FilterPanelAHP = ({ isOpen, onClose, onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters || {
    location: "",
    district: "",
    propertyType: "all",
    bedrooms: "",
    bathrooms: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    selectedCriteria: ["c1","c2","c3","c4","c5","c6"],
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  const API_URL = "http://localhost:5000/api";

  // load provinces
  useEffect(() => {
    fetch(`${API_URL}/provinces`)
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error(err));
  }, []);

  // load districts khi chọn tỉnh
  useEffect(() => {
    if (!filters.location) return setDistricts([]);
    fetch(`${API_URL}/districts?province_id=${parseInt(filters.location)}`)
      .then(res => res.json())
      .then(data => setDistricts(data))
      .catch(err => console.error(err));
  }, [filters.location]);

  const handleApply = () => {
    const finalFilters = {
      location: filters.location ? parseInt(filters.location) : null,
      district: filters.district ? parseInt(filters.district) : null,
      propertyType: filters.propertyType && filters.propertyType !== "all" ? filters.propertyType : null,
      bedrooms: filters.bedrooms ? parseInt(filters.bedrooms) : null,
      bathrooms: filters.bathrooms ? parseInt(filters.bathrooms) : null,
      maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : null,
      minArea: filters.minArea ? parseInt(filters.minArea) : null,
      maxArea: filters.maxArea ? parseInt(filters.maxArea) : null,
      page: 1,
      limit: 10,
      selectedCriteria: filters.selectedCriteria && filters.selectedCriteria.length > 0
        ? filters.selectedCriteria
        : ["c1","c2","c3","c4","c5","c6"],
    };
    console.log("🔥 Apply filters:", finalFilters);
    onFilterChange(finalFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      location: "",
      district: "",
      propertyType: "all",
      bedrooms: "",
      bathrooms: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      selectedCriteria: ["c1","c2","c3","c4","c5","c6"],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // toggle checkbox tiêu chí
  const toggleCriteria = (c) => {
    let updated = filters.selectedCriteria ? [...filters.selectedCriteria] : [];
    if (updated.includes(c)) {
      updated = updated.filter(x => x !== c);
    } else {
      updated.push(c);
    }
    setFilters({ ...filters, selectedCriteria: updated });
  };

  return (
    <div
      className={`transition-all duration-300 ${isOpen ? "w-72 p-4" : "w-0 p-0 overflow-hidden"} bg-surface border-r border-border`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Bộ lọc & AHP</h3>
        <button onClick={onClose}>
          <Icon name="XMark" size={20} />
        </button>
      </div>

      {/* Vị trí */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
        <select
          className="w-full border px-2 py-1 rounded"
          value={filters.location || ""}
          onChange={e => setFilters({ ...filters, location: e.target.value, district: "" })}
        >
          <option value="">Tất cả</option>
          {provinces.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <label className="block text-sm font-medium mt-2 mb-1">Quận/Huyện</label>
        <select
          className="w-full border px-2 py-1 rounded"
          value={filters.district || ""}
          onChange={e => setFilters({ ...filters, district: e.target.value })}
        >
          <option value="">Tất cả</option>
          {districts.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Loại BĐS */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Loại bất động sản</label>
        <select
          className="w-full border px-2 py-1 rounded"
          value={filters.propertyType || "all"}
          onChange={e => setFilters({ ...filters, propertyType: e.target.value })}
        >
          <option value="all">Tất cả</option>
          <option value="Nhà phố">Nhà</option>
          <option value="Căn hộ">Căn hộ</option>
          <option value="Biệt thự">Biệt thự</option>
        </select>
      </div>

      {/* Giá */}
      <div className="mb-4">
        <label className="block text-sm font-medium mt-2 mb-1">Giá tối đa</label>
        <select
          className="w-full border px-2 py-1 rounded"
          value={filters.maxPrice || ""}
          onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
        >
          <option value="">Tất cả</option>
          {Array.from({ length: 30 }, (_, i) => (i + 1) * 500_000_000).map(price => (
            <option key={price} value={price}>{price.toLocaleString()} VNĐ</option>
          ))}
        </select>
      </div>

      {/* Diện tích */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Diện tích (m²)</label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Tối thiểu"
            className="w-1/2 border px-2 py-1 rounded"
            value={filters.minArea || ""}
            onChange={e => setFilters({ ...filters, minArea: e.target.value })}
          />
          <input
            type="number"
            placeholder="Tối đa"
            className="w-1/2 border px-2 py-1 rounded"
            value={filters.maxArea || ""}
            onChange={e => setFilters({ ...filters, maxArea: e.target.value })}
          />
        </div>
      </div>

      {/* Phòng ngủ / Phòng tắm */}
      <div className="mb-4">
        <label className="block text-sm font-medium mt-2 mb-1">Phòng ngủ</label>
        <select
          className="w-full border px-2 py-1 rounded"
          value={filters.bedrooms || ""}
          onChange={e => setFilters({ ...filters, bedrooms: e.target.value })}
        >
          <option value="">Tất cả</option>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} phòng</option>)}
        </select>

        <label className="block text-sm font-medium mt-2 mb-1">Phòng tắm</label>
        <select
          className="w-full border px-2 py-1 rounded"
          value={filters.bathrooms || ""}
          onChange={e => setFilters({ ...filters, bathrooms: e.target.value })}
        >
          <option value="">Tất cả</option>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} phòng</option>)}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex space-x-2 mt-4">
        <button
          onClick={handleApply}
          className="flex-1 bg-primary text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          Áp dụng
        </button>
        <button
          onClick={handleReset}
          className="flex-1 border px-4 py-2 rounded hover:bg-gray-100"
        >
          Đặt lại
        </button>
      </div>
    </div>
  );
};

export default FilterPanelAHP;
