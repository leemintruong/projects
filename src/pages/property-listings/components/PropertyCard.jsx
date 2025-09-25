import React from "react";
import Icon from "../../../components/AppIcon";

const PropertyCard = ({ property, variant = "list", isHighlighted }) => {
  return (
    <div
      className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full ${
        isHighlighted ? "border-primary" : "border-border"
      }`}
    >
      {/* Ảnh */}
      {/* <div className="w-full h-48 overflow-hidden">
        <img
          src={property.property_images?.[0]?.image_url || "/placeholder.png"}
          alt={property.title || "Property"}
          className="w-full h-full object-cover"
        />
      </div> */}

      {/* Nội dung */}
      <div className="p-4 flex flex-col flex-1">
        {/* Tiêu đề */}
        <h3 className="text-lg font-semibold text-text-primary line-clamp-2 mb-1">
          {property.title || "Unknown property"}
        </h3>

        {/* Địa chỉ */}
        <p className="text-text-secondary text-sm flex-1 overflow-hidden">
          {property.address || "No address"}
        </p>

        {/* Thông tin chi tiết */}
        <div className="mt-2 flex items-center justify-between text-sm text-text-secondary">
          <span className="flex items-center">
            {property.bedrooms || 0} <Icon name="Bed" size={16} className="inline ml-1" />
          </span>
          <span className="flex items-center">
            {property.bathrooms || 0} <Icon name="Bath" size={16} className="inline ml-1" />
          </span>
          <span>{property.price ? `${property.price.toLocaleString()} ₫` : "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

