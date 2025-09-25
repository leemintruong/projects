import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import PropertyCard from "./components/PropertyCard";
import FilterPanel from "./components/FilterPanelAHP";
import SortDropdown from "./components/SortDropdown";

const API_URL = "http://localhost:5000/api";

const PropertyListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filteredAhpData, setFilteredAhpData] = useState([]);
  const [ahpDetail, setAhpDetail] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef();
  const lastPropertyElementRef = useRef();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    location: searchParams.get("location") || "",
    district: searchParams.get("district") || "",
    ward: searchParams.get("ward") || "",
    propertyType: searchParams.get("propertyType") || "all",
    maxPrice: searchParams.get("maxPrice") || "",
    minArea: searchParams.get("minArea") || "",
    maxArea: searchParams.get("maxArea") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
  });

  // load tỉnh/huyện/xã
  useEffect(() => {
    fetch(`${API_URL}/provinces`)
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!filters.location) return setDistricts([]);
    fetch(`${API_URL}/districts?province_id=${filters.location}`)
      .then((res) => res.json())
      .then((data) => setDistricts(data))
      .catch(console.error);
  }, [filters.location]);

  useEffect(() => {
    if (!filters.district) return setWards([]);
    fetch(`${API_URL}/wards?district_id=${filters.district}`)
      .then((res) => res.json())
      .then((data) => setWards(data))
      .catch(console.error);
  }, [filters.district]);

  const buildQueryParams = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all") params.set(key, value);
    });
    params.set("page", page);
    params.set("limit", 10);
    return params.toString();
  };

  // fetch properties mặc định (chưa lọc AHP)
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams(filters);
      const propsRes = await fetch(`${API_URL}/properties?${queryParams}`);
      const propsJson = await propsRes.json();
      const propsData = Array.isArray(propsJson) ? propsJson : propsJson.data || [];

      const combinedProps = page === 1 ? propsData : [...properties, ...propsData];
      setProperties(combinedProps);
      setHasMore(propsData.length === 10);

      const sorted = sortProperties(combinedProps, sortBy);
      setFilteredProperties(sorted);
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  // gọi API AHP khi Apply filter
  const applyFilters = async (filters) => {
    try {
      const query = new URLSearchParams();
      if (filters.location) query.append("location", filters.location);
      if (filters.district) query.append("district", filters.district);
      if (filters.propertyType) query.append("propertyType", filters.propertyType);
      if (filters.bedrooms) query.append("bedrooms", filters.bedrooms);
      if (filters.bathrooms) query.append("bathrooms", filters.bathrooms);
      if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);
      if (filters.minArea) query.append("minArea", filters.minArea);
      if (filters.maxArea) query.append("maxArea", filters.maxArea);

      query.append("page", 1);
      query.append("limit", 10);

      const res = await fetch(`${API_URL}/properties/ahp?${query.toString()}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();

      const data = Array.isArray(json.data) ? json.data : [];

      setProperties(data);
      setFilteredProperties(data);
      setFilteredAhpData(data);
      setAhpDetail(null);

      console.log("✅ Data sau khi applyFilters:", data);
    } catch (err) {
      console.error("Error applying filters:", err);
      setFilteredProperties([]);
      setFilteredAhpData([]);
      setAhpDetail(null);
    }
  };

  // gọi API AHP detail kèm filter hiện tại
  const fetchAhpDetail = async (id) => {
    try {
      const query = new URLSearchParams();
      if (filters.location) query.append("location", filters.location);
      if (filters.district) query.append("district", filters.district);
      if (filters.propertyType) query.append("propertyType", filters.propertyType);
      if (filters.bedrooms) query.append("bedrooms", filters.bedrooms);
      if (filters.bathrooms) query.append("bathrooms", filters.bathrooms);
      if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);
      if (filters.minArea) query.append("minArea", filters.minArea);
      if (filters.maxArea) query.append("maxArea", filters.maxArea);

      const res = await fetch(`${API_URL}/properties/ahp/${id}?${query.toString()}`);
      const data = await res.json();
      setAhpDetail(data);
    } catch (err) {
      console.error("Error fetch AHP detail:", err);
    }
  };

  const sortProperties = (propsToSort, sortOption) => {
    const sorted = [...propsToSort];
    switch (sortOption) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "newest":
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      default:
        return sorted;
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const sorted = sortProperties(filteredProperties, newSortBy);
    setFilteredProperties(sorted);
    setFilteredAhpData(sorted);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setProperties([]);
    setFilteredProperties([]);
    setFilteredAhpData([]);
    setAhpDetail(null);
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all") newSearchParams.set(key, value);
    });
    setSearchParams(newSearchParams);

    applyFilters(newFilters);
  };

  // infinite scroll
  useEffect(() => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) setPage((prev) => prev + 1);
    });

    if (lastPropertyElementRef.current) observerRef.current.observe(lastPropertyElementRef.current);
  }, [loading, hasMore]);

  const getBreadcrumbs = () => {
    const crumbs = [
      { label: "Trang chủ", path: "/" },
      { label: "Bất động sản", path: "/property-listings" },
    ];
    if (filters.location) {
      const province = provinces.find((p) => p.id == filters.location);
      crumbs.push({ label: province?.name || filters.location, path: null });
    }
    if (filters.district) {
      const district = districts.find((d) => d.id == filters.district);
      crumbs.push({ label: district?.name || filters.district, path: null });
    }
    if (filters.ward) {
      const ward = wards.find((w) => w.id == filters.ward);
      crumbs.push({ label: ward?.name || filters.ward, path: null });
    }
    if (filters.propertyType && filters.propertyType !== "all")
      crumbs.push({ label: filters.propertyType, path: null });
    return crumbs;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-18">
        {/* Breadcrumb */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              {getBreadcrumbs().map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <Icon name="ChevronRight" size={14} className="text-text-secondary" />
                  )}
                  {crumb.path ? (
                    <Link
                      to={crumb.path}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-text-primary font-medium">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>

        {/* Header & Controls */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Bất động sản đang bán</h1>
              <p className="text-text-secondary mt-1">
                {loading ? "Đang tải..." : `${filteredProperties.length} bất động sản tìm thấy`}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <SortDropdown value={sortBy} onChange={handleSortChange} />
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700"
              >
                <Icon name="SlidersHorizontal" size={16} />
                <span className="hidden sm:inline">Bộ lọc</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto flex">
          <FilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />

          <div className="flex-1 min-w-0">
            {/* Danh sách PropertyCard */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div>Đang tải...</div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Không tìm thấy bất động sản
                  </h3>
                  <p className="text-text-secondary">
                    Thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc
                  </p>
                </div>
              ) : (
                filteredProperties.map((property, index) => (
                  <div
                    key={property.property_id || `property-${index}`}
                    ref={index === filteredProperties.length - 1 ? lastPropertyElementRef : null}
                    onClick={() => {
                      setSelectedProperty(property);
                      fetchAhpDetail(property.property_id);
                    }}
                    className="cursor-pointer"
                  >
                    <PropertyCard
                      property={property}
                      variant="list"
                      isHighlighted={selectedProperty?.property_id === property.property_id}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Bảng AHP tổng hợp */}
            {filteredAhpData.length > 0 && (
              <div className="p-6 overflow-x-auto mt-6">
                <h2 className="text-xl font-semibold mb-4">Bảng AHP</h2>
                <table className="min-w-full border border-border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-1 border">Title</th>
                      <th className="px-2 py-1 border">C1 (Vị trí)</th>
                      <th className="px-2 py-1 border">C2 (Diện tích)</th>
                      <th className="px-2 py-1 border">C3 (Loại)</th>
                      <th className="px-2 py-1 border">C4 (Giá)</th>
                      <th className="px-2 py-1 border">C5 (Phòng ngủ)</th>
                      <th className="px-2 py-1 border">C6 (Phòng tắm)</th>
                      <th className="px-2 py-1 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAhpData.map((p) => (
                      <tr key={p.property_id}>
                        <td className="px-2 py-1 border">{p.title}</td>
                        <td className="px-2 py-1 border">{p.c1}</td>
                        <td className="px-2 py-1 border">{p.c2}</td>
                        <td className="px-2 py-1 border">{p.c3}</td>
                        <td className="px-2 py-1 border">{p.c4}</td>
                        <td className="px-2 py-1 border">{p.c5}</td>
                        <td className="px-2 py-1 border">{p.c6}</td>
                        <td className="px-2 py-1 border font-bold">{p.total_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bảng chi tiết AHP */}
            {ahpDetail && (
              <div className="p-6 mt-4 bg-white border rounded shadow">
                <h2 className="text-xl font-semibold mb-4">
                  Chi tiết AHP cho: {ahpDetail.title}
                </h2>
                <table className="min-w-full border border-border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-1 border">C1 (Vị trí)</th>
                      <th className="px-2 py-1 border">C2 (Diện tích)</th>
                      <th className="px-2 py-1 border">C3 (Loại)</th>
                      <th className="px-2 py-1 border">C4 (Giá)</th>
                      <th className="px-2 py-1 border">C5 (Phòng ngủ)</th>
                      <th className="px-2 py-1 border">C6 (Phòng tắm)</th>
                      <th className="px-2 py-1 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 py-1 border">{ahpDetail.c1}</td>
                      <td className="px-2 py-1 border">{ahpDetail.c2}</td>
                      <td className="px-2 py-1 border">{ahpDetail.c3}</td>
                      <td className="px-2 py-1 border">{ahpDetail.c4}</td>
                      <td className="px-2 py-1 border">{ahpDetail.c5}</td>
                      <td className="px-2 py-1 border">{ahpDetail.c6}</td>
                      <td className="px-2 py-1 border font-bold">
                        {ahpDetail.total_score}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyListings;
