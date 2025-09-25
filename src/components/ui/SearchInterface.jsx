import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const SearchInterface = ({ variant = 'hero', onSearch, initialFilters = {} }) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters?.query || '');
  const [location, setLocation] = useState(initialFilters?.location || '');
  const [propertyType, setPropertyType] = useState(initialFilters?.propertyType || '');
  const [priceRange, setPriceRange] = useState(initialFilters?.priceRange || '');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const filtersRef = useRef(null);
  const locationRef = useRef(null);

  const propertyTypes = [
    { value: '', label: 'Tất cả loại hình' },
    { value: 'house', label: 'Nhà riêng' },
    { value: 'apartment', label: 'Căn hộ' },
    { value: 'condo', label: 'Chung cư' },
    { value: 'townhouse', label: 'Nhà phố' },
    { value: 'villa', label: 'Biệt thự' },
    { value: 'commercial', label: 'Thương mại' }
  ];

  const priceRanges = [
    { value: '', label: 'Mọi mức giá' },
    { value: '0-1000000000', label: 'Dưới 1 tỷ' },
    { value: '1000000000-2000000000', label: '1 - 2 tỷ' },
    { value: '2000000000-3000000000', label: '2 - 3 tỷ' },
    { value: '3000000000-5000000000', label: '3 - 5 tỷ' },
    { value: '5000000000-10000000000', label: '5 - 10 tỷ' },
    { value: '10000000000+', label: 'Trên 10 tỷ' }
  ];

  const locationSuggestions = [
    'TP. Hồ Chí Minh',
    'Hà Nội',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Biên Hòa, Đồng Nai',
    'Nha Trang, Khánh Hòa',
    'Huế, Thừa Thiên Huế',
    'Buôn Ma Thuột, Đắk Lắk',
    'Vũng Tàu, Bà Rịa-Vũng Tàu'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef?.current && !filtersRef?.current?.contains(event?.target)) {
        setIsFiltersOpen(false);
      }
      if (locationRef?.current && !locationRef?.current?.contains(event?.target)) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    const searchParams = {
      query: searchQuery,
      location,
      propertyType,
      priceRange
    };
    
    if (onSearch) {
      onSearch(searchParams);
    } else {
      // Default navigation to property listings
      const params = new URLSearchParams();
      Object.entries(searchParams)?.forEach(([key, value]) => {
        if (value) params?.append(key, value);
      });
      window.location.href = `/property-listings?${params?.toString()}`;
    }
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setIsLocationDropdownOpen(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setPropertyType('');
    setPriceRange('');
  };

  const hasActiveFilters = searchQuery || location || propertyType || priceRange;

  if (variant === 'hero') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Main Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="Search" size={24} className="text-secondary" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              placeholder="Tìm kiếm theo khu vực, thành phố hoặc đặc điểm bất động sản..."
              className="block w-full pl-12 pr-4 py-4 text-lg border border-border rounded-lg 
                       focus:border-border-focus focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
                       transition-all duration-200 ease-out bg-surface text-text-primary
                       placeholder-text-secondary shadow-elevation-1"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Location Filter */}
            <div className="relative" ref={locationRef}>
              <button
                type="button"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border 
                         rounded-md hover:bg-secondary-100 transition-all duration-200 ease-out
                         micro-interaction"
              >
                <Icon name="MapPin" size={16} />
                <span className="text-sm font-medium">
                  {location || 'Vị trí'}
                </span>
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className={`transition-transform duration-200 ${
                    isLocationDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute top-full mt-1 w-64 bg-surface rounded-md shadow-elevation-3 
                              border border-border z-dropdown">
                  <div className="p-2">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e?.target?.value)}
                      placeholder="Nhập tên thành phố..."
                      className="w-full px-3 py-2 border border-border rounded-md text-sm
                               focus:border-border-focus focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {locationSuggestions?.filter(suggestion => 
                        suggestion?.toLowerCase()?.includes(location?.toLowerCase())
                      )?.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleLocationSelect(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-secondary-100 transition-colors duration-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Type Filter */}
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e?.target?.value)}
              className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium
                       focus:border-border-focus focus:ring-1 focus:ring-primary-500 
                       transition-all duration-200 ease-out"
            >
              {propertyTypes?.map((type) => (
                <option key={type?.value} value={type?.value}>
                  {type?.label}
                </option>
              ))}
            </select>

            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e?.target?.value)}
              className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium
                       focus:border-border-focus focus:ring-1 focus:ring-primary-500 
                       transition-all duration-200 ease-out"
            >
              {priceRanges?.map((range) => (
                <option key={range?.value} value={range?.value}>
                  {range?.label}
                </option>
              ))}
            </select>

            {/* Advanced Filters Toggle */}
            <button
              type="button"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border 
                       rounded-md hover:bg-secondary-100 transition-all duration-200 ease-out
                       micro-interaction"
            >
              <Icon name="SlidersHorizontal" size={16} />
              <span className="text-sm font-medium">Bộ lọc khác</span>
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                <Icon name="X" size={14} />
                <span>Xóa</span>
              </button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {isFiltersOpen && (
            <div 
              ref={filtersRef}
              className="bg-surface border border-border rounded-lg p-6 shadow-elevation-2
                       progressive-disclosure"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Phòng ngủ
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:border-border-focus focus:ring-1 focus:ring-primary-500">
                    <option value="">Bất kỳ</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Phòng tắm
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:border-border-focus focus:ring-1 focus:ring-primary-500">
                    <option value="">Bất kỳ</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Diện tích (m²)
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:border-border-focus focus:ring-1 focus:ring-primary-500">
                    <option value="">Bất kỳ</option>
                    <option value="0-50">Dưới 50m²</option>
                    <option value="50-80">50 - 80m²</option>
                    <option value="80-120">80 - 120m²</option>
                    <option value="120+">Trên 120m²</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold
                       hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
                       transition-all duration-200 ease-out micro-interaction shadow-elevation-2"
            >
              Tìm Bất Động Sản
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Compact variant for header
  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="Search" size={16} className="text-secondary" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          placeholder="Tìm bất động sản..."
          className="block w-full pl-9 pr-3 py-2 border border-border rounded-md text-sm
                   focus:border-border-focus focus:ring-1 focus:ring-primary-500 
                   transition-all duration-200 ease-out bg-surface text-text-primary
                   placeholder-text-secondary"
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium
                 hover:bg-primary-700 transition-all duration-200 ease-out micro-interaction"
      >
        Tìm
      </button>
    </form>
  );
};

export default SearchInterface;