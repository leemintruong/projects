// src/pages/user-profile-settings/components/SavedSearches.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SavedSearches = ({ user, onDataChange }) => {
  const [savedSearches, setSavedSearches] = useState([
    {
      id: '1',
      name: 'Căn hộ trung tâm thành phố',
      criteria: {
        location: 'Downtown',
        propertyType: 'Căn hộ',
        priceRange: '$300K - $500K',
        bedrooms: '2+',
        bathrooms: '2+'
      },
      frequency: 'daily',
      isActive: true,
      resultCount: 23,
      lastUpdated: '2024-01-15',
      created: '2023-12-01'
    },
    {
      id: '2',
      name: 'Nhà gia đình ngoại ô',
      criteria: {
        location: 'Westside',
        propertyType: 'Nhà',
        priceRange: '$400K - $700K',
        bedrooms: '3+',
        bathrooms: '2+'
      },
      frequency: 'weekly',
      isActive: true,
      resultCount: 8,
      lastUpdated: '2024-01-14',
      created: '2023-11-15'
    },
    {
      id: '3',
      name: 'Bất động sản đầu tư',
      criteria: {
        location: 'All Areas',
        propertyType: 'Multi-family',
        priceRange: '$200K - $400K',
        bedrooms: 'Bất kỳ',
        bathrooms: 'Bất kỳ'
      },
      frequency: 'immediate',
      isActive: false,
      resultCount: 12,
      lastUpdated: '2024-01-10',
      created: '2023-10-20'
    }
  ]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSearch, setEditingSearch] = useState(null);

  const handleToggleActive = (searchId) => {
    setSavedSearches(prev => 
      prev?.map(search => 
        search?.id === searchId 
          ? { ...search, isActive: !search?.isActive }
          : search
      )
    );
    onDataChange?.();
  };

  const handleEdit = (search) => {
    setEditingSearch(search);
    setShowEditModal(true);
  };

  const handleDelete = (searchId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tìm kiếm đã lưu này?')) {
      setSavedSearches(prev => prev?.filter(search => search?.id !== searchId));
      onDataChange?.();
    }
  };

  const handleSaveEdit = (updatedSearch) => {
    setSavedSearches(prev => 
      prev?.map(search => 
        search?.id === updatedSearch?.id ? updatedSearch : search
      )
    );
    setShowEditModal(false);
    setEditingSearch(null);
    onDataChange?.();
  };

  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'immediate': return 'Zap';
      case 'daily': return 'Calendar';
      case 'weekly': return 'CalendarDays';
      default: return 'Clock';
    }
  };

  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case 'immediate': return 'text-error';
      case 'daily': return 'text-warning';
      case 'weekly': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-elevation-1">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Tìm kiếm đã lưu
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Quản lý cảnh báo bất động sản và tần suất nhận thông báo
            </p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200">
            Tạo tìm kiếm mới
          </button>
        </div>
      </div>

      <div className="p-6">
        {savedSearches?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">Chưa có tìm kiếm nào</h3>
            <p className="text-text-secondary mb-4">
              Tạo tìm kiếm đầu tiên để nhận thông báo về bất động sản phù hợp tiêu chí của bạn.
            </p>
            <button className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200">
              Tạo tìm kiếm đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedSearches?.map((search) => (
              <div key={search?.id} className="border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-text-primary">{search?.name}</h3>
                      <div className={`flex items-center space-x-1 ${getFrequencyColor(search?.frequency)}`}>
                        <Icon name={getFrequencyIcon(search?.frequency)} size={16} />
                        <span className="text-sm font-medium capitalize">
                          {search?.frequency === 'immediate' ? 'Ngay lập tức' : search?.frequency === 'daily' ? 'Hàng ngày' : 'Hàng tuần'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          search?.isActive ? 'bg-success' : 'bg-secondary-300'
                        }`}></div>
                        <span className={`text-sm ${
                          search?.isActive ? 'text-success' : 'text-text-secondary'
                        }`}>
                          {search?.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-text-secondary mb-3">
                      <div>
                        <span className="font-medium">Địa điểm:</span> {search?.criteria?.location}
                      </div>
                      <div>
                        <span className="font-medium">Loại:</span> {search?.criteria?.propertyType}
                      </div>
                      <div>
                        <span className="font-medium">Giá:</span> {search?.criteria?.priceRange}
                      </div>
                      <div>
                        <span className="font-medium">Phòng ngủ:</span> {search?.criteria?.bedrooms}
                      </div>
                      <div>
                        <span className="font-medium">Phòng tắm:</span> {search?.criteria?.bathrooms}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      <span>
                        <span className="font-medium text-primary">{search?.resultCount}</span> tin đăng
                      </span>
                      <span>Cập nhật: {search?.lastUpdated}</span>
                      <span>Tạo: {search?.created}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(search?.id)}
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        search?.isActive 
                          ? 'text-warning hover:bg-warning-100' :'text-success hover:bg-success-100'
                      }`}
                      title={search?.isActive ? 'Tạm dừng thông báo' : 'Tiếp tục thông báo'}
                    >
                      <Icon name={search?.isActive ? 'Pause' : 'Play'} size={20} />
                    </button>
                    <button
                      onClick={() => handleEdit(search)}
                      className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-secondary-100 transition-colors duration-200"
                      title="Chỉnh sửa tìm kiếm"
                    >
                      <Icon name="Edit" size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(search?.id)}
                      className="p-2 rounded-md text-error hover:bg-error-100 transition-colors duration-200"
                      title="Xóa tìm kiếm"
                    >
                      <Icon name="Trash2" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-modal flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Chỉnh sửa tìm kiếm đã lưu</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tên tìm kiếm
                </label>
                <input
                  type="text"
                  value={editingSearch?.name}
                  onChange={(e) => setEditingSearch(prev => ({ ...prev, name: e?.target?.value }))}
                  className="block w-full px-4 py-2 border border-border rounded-md focus:border-border-focus focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tần suất thông báo
                </label>
                <select
                  value={editingSearch?.frequency}
                  onChange={(e) => setEditingSearch(prev => ({ ...prev, frequency: e?.target?.value }))}
                  className="block w-full px-4 py-2 border border-border rounded-md focus:border-border-focus focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                >
                  <option value="immediate">Ngay lập tức</option>
                  <option value="daily">Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => handleSaveEdit(editingSearch)}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                Lưu thay đổi
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSearch(null);
                }}
                className="flex-1 border border-border text-text-secondary px-4 py-2 rounded-md font-medium hover:bg-secondary-100 transition-colors duration-200"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedSearches;
