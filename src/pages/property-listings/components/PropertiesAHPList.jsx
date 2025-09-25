import React, { useState, useEffect } from "react";
import FilterPanelAHP from "./FilterPanelAHP";

const PropertiesAHPPage = () => {
  const [filters, setFilters] = useState({});
  const [properties, setProperties] = useState([]);

  const fetchProperties = async (filters) => {
    // Lọc bỏ null/undefined
    const query = Object.fromEntries(
      Object.entries(filters).filter(([k, v]) => v !== null && v !== "" && v !== undefined)
    );
    const params = new URLSearchParams(query).toString();
    const res = await fetch(`http://localhost:5000/api/properties/ahp?${params}`);
    const data = await res.json();
    setProperties(data);
  };

  useEffect(() => {
    fetchProperties(filters); // lần đầu sẽ fetch không filter
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  return (
    <div className="flex">
      <FilterPanelAHP
        isOpen={true}
        onClose={() => {}}
        initialFilters={filters}
        onFilterChange={handleFilterChange}
      />

      <div className="flex-1 p-4">
        {properties.length === 0 ? (
          <p>Không có bất động sản nào</p>
        ) : (
          properties.map(p => (
            <div key={p.id} className="border p-2 mb-2">
              <h3>{p.title}</h3>
              <p>Loại: {p.property_type}</p>
              <p>Giá: {p.price.toLocaleString()} VNĐ</p>
              <p>Phòng ngủ: {p.bedrooms}, Phòng tắm: {p.bathrooms}</p>
              <p>Total AHP score: {p.total_score}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PropertiesAHPList;
