// src/pages/property-details/components/ContactForm.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ContactForm = ({ property, agent, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Tôi quan tâm đến ${property?.title} tại ${property?.address}. Vui lòng liên hệ để xem nhà hoặc cung cấp thêm thông tin.`,
    contactMethod: 'email', // 'email', 'phone', 'text'
    preferredTime: 'anytime' // 'morning', 'afternoon', 'evening', 'anytime'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Tên không được để trống';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData?.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData?.phone)) {
      newErrors.phone = 'Vui lòng nhập số điện thoại hợp lệ';
    }

    if (!formData?.message?.trim()) {
      newErrors.message = 'Tin nhắn không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);

      // Tự động đóng sau 3 giây
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Lỗi khi gửi form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Check" size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Gửi tin nhắn thành công!
            </h2>
            <p className="text-text-secondary mb-6">
              Cảm ơn bạn đã quan tâm. {agent?.name} sẽ liên hệ bạn trong vòng 24 giờ.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-all duration-200"
            >
              Đóng
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-4">
                <Image
                  src={agent?.avatar}
                  alt={agent?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold text-text-primary">
                    Liên hệ {agent?.name}
                  </h2>
                  <p className="text-text-secondary">
                    Về {property?.title}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary-100 rounded-md transition-all duration-200"
                aria-label="Đóng form"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Thông tin cá nhân */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData?.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                      errors?.name ? 'border-error' : 'border-border focus:border-primary'
                    }`}
                    placeholder="Nhập họ và tên"
                  />
                  {errors?.name && <p className="mt-1 text-sm text-error">{errors?.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                      errors?.email ? 'border-error' : 'border-border focus:border-primary'
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors?.email && <p className="mt-1 text-sm text-error">{errors?.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData?.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                    errors?.phone ? 'border-error' : 'border-border focus:border-primary'
                  }`}
                  placeholder="(555) 123-4567"
                />
                {errors?.phone && <p className="mt-1 text-sm text-error">{errors?.phone}</p>}
              </div>

              {/* Ưu tiên liên hệ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactMethod" className="block text-sm font-medium text-text-primary mb-2">
                    Phương thức liên hệ
                  </label>
                  <select
                    id="contactMethod"
                    name="contactMethod"
                    value={formData?.contactMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Gọi điện</option>
                    <option value="text">Nhắn tin</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-text-primary mb-2">
                    Thời gian thuận tiện
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData?.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    <option value="anytime">Bất cứ lúc nào</option>
                    <option value="morning">Buổi sáng (8 AM - 12 PM)</option>
                    <option value="afternoon">Buổi chiều (12 PM - 5 PM)</option>
                    <option value="evening">Buổi tối (5 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              {/* Tin nhắn */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                  Tin nhắn *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData?.message}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 resize-vertical ${
                    errors?.message ? 'border-error' : 'border-border focus:border-primary'
                  }`}
                  placeholder="Nhập tin nhắn của bạn..."
                />
                {errors?.message && <p className="mt-1 text-sm text-error">{errors?.message}</p>}
              </div>

              {/* Hành động nhanh */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    message: `Tôi muốn xem ${property?.title} tại ${property?.address}.` 
                  }))}
                  className="px-3 py-1 text-sm bg-secondary-100 text-text-secondary rounded-md hover:bg-secondary-200 transition-all duration-200"
                >
                  Đặt lịch xem
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    message: `Tôi cần thêm thông tin về ${property?.title}. Bạn có thể cung cấp thông tin về khu vực, trường học, tiện ích không?` 
                  }))}
                  className="px-3 py-1 text-sm bg-secondary-100 text-text-secondary rounded-md hover:bg-secondary-200 transition-all duration-200"
                >
                  Yêu cầu thông tin
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    message: `Giá tốt nhất bạn có thể cung cấp cho ${property?.title} là bao nhiêu?` 
                  }))}
                  className="px-3 py-1 text-sm bg-secondary-100 text-text-secondary rounded-md hover:bg-secondary-200 transition-all duration-200"
                >
                  Thảo luận giá
                </button>
              </div>

              {/* Nút gửi */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-border text-text-secondary rounded-md hover:bg-secondary-100 transition-all duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-md transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-secondary text-text-secondary cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={16} />
                      <span>Gửi tin nhắn</span>
                    </>
                  )}
                </button>
              </div>

              {/* Thông tin bảo mật */}
              <div className="text-xs text-text-secondary bg-secondary-100 p-3 rounded-md mt-4">
                <Icon name="Info" size={12} className="inline mr-1" />
                Thông tin của bạn chỉ được chia sẻ với môi giới và sẽ không được sử dụng cho mục đích marketing.
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
