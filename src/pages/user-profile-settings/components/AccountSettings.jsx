// src/pages/user-profile-settings/components/AccountSettings.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AccountSettings = ({ user, onDataChange }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailPreferences, setEmailPreferences] = useState({
    listingAlerts: true,
    priceDrops: true,
    newListings: false,
    marketReports: true,
    promotions: false
  });
  const [notificationSettings, setNotificationSettings] = useState({
    showingConfirmations: true,
    messageNotifications: true,
    leadAlerts: user?.role === 'agent',
    marketingEmails: false,
    smsNotifications: true
  });

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e?.preventDefault();
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      alert('Mật khẩu mới không khớp');
      return;
    }
    // Simulate password change
    console.log('Đã gửi thay đổi mật khẩu');
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    onDataChange?.();
  };

  const handlePreferenceChange = (category, field, value) => {
    if (category === 'email') {
      setEmailPreferences(prev => ({ ...prev, [field]: value }));
    } else {
      setNotificationSettings(prev => ({ ...prev, [field]: value }));
    }
    onDataChange?.();
  };

  return (
    <div className="space-y-6">
      {/* Cài đặt mật khẩu */}
      <div className="bg-surface rounded-lg shadow-elevation-1">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary font-heading">
            Mật khẩu & Bảo mật
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Quản lý mật khẩu và cài đặt bảo mật
          </p>
        </div>

        <div className="p-6">
          {!showPasswordForm ? (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-text-primary">Mật khẩu</h3>
                <p className="text-text-secondary text-sm">Đổi lần cuối 3 tháng trước</p>
              </div>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                Thay đổi mật khẩu
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-text-primary mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData?.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                  className="block w-full px-4 py-3 border border-border rounded-md shadow-sm focus:border-border-focus focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-text-primary mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData?.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                  className="block w-full px-4 py-3 border border-border rounded-md shadow-sm focus:border-border-focus focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData?.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                  className="block w-full px-4 py-3 border border-border rounded-md shadow-sm focus:border-border-focus focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200"
                >
                  Cập nhật mật khẩu
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="border border-border text-text-secondary px-4 py-2 rounded-md font-medium hover:bg-secondary-100 transition-colors duration-200"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Cài đặt Email */}
      <div className="bg-surface rounded-lg shadow-elevation-1">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary font-heading">
            Cài đặt Email
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Chọn những email bạn muốn nhận
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {Object.entries({
              listingAlerts: 'Thông báo bất động sản mới trong tìm kiếm đã lưu',
              priceDrops: 'Thông báo giảm giá bất động sản yêu thích',
              newListings: 'Bản tin hàng tuần về danh sách mới',
              marketReports: 'Báo cáo thị trường hàng tháng và phân tích',
              promotions: 'Khuyến mãi và cập nhật từ nền tảng'
            })?.map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex-1">
                  <label htmlFor={key} className="text-sm font-medium text-text-primary">
                    {label}
                  </label>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id={key}
                    checked={emailPreferences?.[key]}
                    onChange={(e) => handlePreferenceChange('email', key, e?.target?.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cài đặt Thông báo */}
      <div className="bg-surface rounded-lg shadow-elevation-1">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary font-heading">
            Cài đặt Thông báo
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Điều khiển cách bạn nhận thông báo
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {Object.entries({
              showingConfirmations: 'Hiển thị xác nhận và nhắc nhở',
              messageNotifications: 'Thông báo tin nhắn mới',
              ...(user?.role === 'agent' && { leadAlerts: 'Thông báo khách hàng tiềm năng mới' }),
              marketingEmails: 'Email marketing và khuyến mãi',
              smsNotifications: 'Thông báo qua tin nhắn SMS'
            })?.filter(([key]) => key !== undefined)?.map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex-1">
                  <label htmlFor={`notif-${key}`} className="text-sm font-medium text-text-primary">
                    {label}
                  </label>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id={`notif-${key}`}
                    checked={notificationSettings?.[key]}
                    onChange={(e) => handlePreferenceChange('notification', key, e?.target?.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-secondary-100 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-text-primary">Tần suất thông báo</h4>
                <p className="text-xs text-text-secondary mt-1">
                  Bạn có thể thiết lập tần suất riêng cho từng loại thông báo trong cài đặt nâng cao.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
