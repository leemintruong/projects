import React from "react";

const SortDropdown = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-border rounded-md px-3 py-2 text-sm text-text-primary"
    >
      <option value="relevance">Mức độ liên quan</option>
      <option value="price-low">Giá: Thấp → Cao</option>
      <option value="price-high">Giá: Cao → Thấp</option>
      <option value="newest">Mới nhất</option>
      <option value="oldest">Cũ nhất</option>
    </select>
  );
};

export default SortDropdown;
