// src/pages/agent-dashboard/components/QuickListingForm.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const QuickListingForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    description: '',
    mlsIntegration: true
  });
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const propertyTypes = [
    'Nhà riêng',
    'Chung cư',
    'Nhà phố liền kề',
    'Nhà nhiều hộ',
    'Đất',
    'Bất động sản thương mại'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e?.target?.files);
    const newPhotos = files?.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => {
      const photo = prev?.find(p => p?.id === photoId);
      if (photo?.preview) {
        URL.revokeObjectURL(photo?.preview);
      }
      return prev?.filter(p => p?.id !== photoId);
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.address?.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!formData?.city?.trim()) newErrors.city = 'Vui lòng nhập thành phố';
    if (!formData?.state?.trim()) newErrors.state = 'Vui lòng nhập tỉnh/thành';
    if (!formData?.zipCode?.trim()) newErrors.zipCode = 'Vui lòng nhập mã bưu chính';
    if (!formData?.price?.trim()) newErrors.price = 'Vui lòng nhập giá';
    if (!formData?.propertyType) newErrors.propertyType = 'Vui lòng chọn loại bất động sản';
    if (!formData?.bedrooms?.trim()) newErrors.bedrooms = 'Vui lòng nhập số phòng ngủ';
    if (!formData?.bathrooms?.trim()) newErrors.bathrooms = 'Vui lòng nhập số phòng tắm';
    
    const price = parseFloat(formData?.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Giá không hợp lệ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...formData,
        photos: photos?.map(p => p?.file)
      };
      
      await onSubmit?.(submissionData);
    } catch (error) {
      console.error('Lỗi khi gửi tin đăng:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    photos?.forEach(photo => {
      if (photo?.preview) {
        URL.revokeObjectURL(photo?.preview);
      }
    });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-modal p-4">
      <div className="bg-surface rounded-lg shadow-elevation-5 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Tạo Tin Đăng Mới
            </h2>
            <button
              onClick={handleClose}
              className="text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Property Address */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-medium text-text-primary mb-4">Địa Chỉ Bất Động Sản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Địa chỉ *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData?.address}
                      onChange={handleInputChange}
                      placeholder="123 Đường Chính"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                        errors?.address ? 'border-error' : 'border-border focus:border-border-focus'
                      }`}
                    />
                    {errors?.address && (
                      <p className="text-error text-xs mt-1">{errors?.address}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Thành phố *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData?.city}
                      onChange={handleInputChange}
                      placeholder="Hà Nội"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                        errors?.city ? 'border-error' : 'border-border focus:border-border-focus'
                      }`}
                    />
                    {errors?.city && (
                      <p className="text-error text-xs mt-1">{errors?.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Tỉnh/Thành *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData?.state}
                      onChange={handleInputChange}
                      placeholder="Hồ Chí Minh"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                        errors?.state ? 'border-error' : 'border-border focus:border-border-focus'
                      }`}
                    />
                    {errors?.state && (
                      <p className="text-error text-xs mt-1">{errors?.state}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Property Details */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-medium text-text-primary mb-4">Chi Tiết Bất Động Sản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Giá (VND) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData?.price}
                      onChange={handleInputChange}
                      placeholder="4500000000"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                        errors?.price ? 'border-error' : 'border-border focus:border-border-focus'
                      }`}
                    />
                    {errors?.price && (
                      <p className="text-error text-xs mt-1">{errors?.price}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Loại BĐS *
                    </label>
                    <select
                      name="propertyType"
                      value={formData?.propertyType}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                        errors?.propertyType ? 'border-error' : 'border-border focus:border-border-focus'
                      }`}
                    >
                      <option value="">-- Chọn loại --</option>
                      {propertyTypes?.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors?.propertyType && (
                      <p className="text-error text-xs mt-1">{errors?.propertyType}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Phòng ngủ *
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData?.bedrooms}
                      onChange={handleInputChange}
                      placeholder="3"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                        errors?.bedrooms ? 'border-error' : 'border-border focus:border-border-focus'
                      }`}
                    />
                    {errors?.bedrooms && (
                      <p className="text-error text-xs mt-1">{errors?.bedrooms}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Phòng tắm *
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData?.bathrooms}
                      onChange={handleInputChange}
                      placeholder="2"
                      min="0"
                      step="0.5"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                        errors?.bathrooms ? 'border-error' : 'border-border focus:border-border-focus'
                      }`}
                    />
                    {errors?.bathrooms && (
                      <p className="text-error text-xs mt-1">{errors?.bathrooms}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Photos */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-medium text-text-primary mb-4">Hình Ảnh</h3>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer inline-flex flex-col items-center space-y-2"
                  >
                    <Icon name="Upload" size={32} className="text-secondary-300" />
                    <span className="text-text-secondary">Bấm để tải ảnh lên</span>
                    <span className="text-xs text-text-secondary">PNG, JPG dung lượng tối đa 10MB</span>
                  </label>
                </div>
                
                {photos?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {photos?.map(photo => (
                      <div key={photo?.id} className="relative">
                        <img
                          src={photo?.preview}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(photo?.id)}
                          className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 hover:bg-error-500 transition-colors duration-200"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData?.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Mô tả chi tiết về tiện ích, đặc điểm, vị trí..."
                  className="w-full px-3 py-2 border border-border rounded-md focus:border-border-focus focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                />
              </div>
              
              {/* MLS Integration */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="mlsIntegration"
                    checked={formData?.mlsIntegration}
                    onChange={handleInputChange}
                    id="mls-integration"
                    className="rounded border-border text-primary focus:ring-primary-500"
                  />
                  <label htmlFor="mls-integration" className="text-sm text-text-primary">
                    Đồng bộ với hệ thống MLS
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out micro-interaction"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo Tin Đăng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickListingForm;
