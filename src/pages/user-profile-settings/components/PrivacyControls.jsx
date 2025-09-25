// src/pages/user-profile-settings/components/PrivacyControls.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PrivacyControls = ({ user, onDataChange }) => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // 'public', 'agents-only', 'private'
    showContactInfo: true,
    showListingHistory: user?.role === 'agent',
    allowDirectContact: true,
    showInSearchResults: true,
    shareDataWithPartners: false,
    allowMarketingEmails: false,
    showOnlineStatus: true,
    allowPropertyRecommendations: true,
    publicProfileUrl: `https://estatehub.com/agent/${user?.id || 'user123'}`,
    customProfileUrl: '',
    blockList: []
  });

  const [showBlockUserModal, setShowBlockUserModal] = useState(false);
  const [newBlockedUser, setNewBlockedUser] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSettingChange = (setting, value) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
    onDataChange?.();
  };

  const handleBlockUser = () => {
    if (newBlockedUser?.trim()) {
      setPrivacySettings(prev => ({
        ...prev,
        blockList: [...prev?.blockList, {
          id: Date.now()?.toString(),
          email: newBlockedUser?.trim(),
          dateBlocked: new Date()?.toISOString()?.split('T')?.[0]
        }]
      }));
      setNewBlockedUser('');
      setShowBlockUserModal(false);
      onDataChange?.();
    }
  };

  const handleUnblockUser = (userId) => {
    setPrivacySettings(prev => ({
      ...prev,
      blockList: prev?.blockList?.filter(user => user?.id !== userId)
    }));
    onDataChange?.();
  };

  const handleDeleteAccount = () => {
    console.log('Đang xóa tài khoản');
    setShowDeleteModal(false);
  };

  const visibilityOptions = [
    {
      value: 'public',
      label: 'Công khai',
      description: 'Hồ sơ của bạn hiển thị cho tất cả mọi người'
    },
    {
      value: 'agents-only',
      label: 'Chỉ cho môi giới',
      description: 'Chỉ những môi giới bất động sản đã xác thực mới xem được'
    },
    {
      value: 'private',
      label: 'Riêng tư',
      description: 'Chỉ bạn mới có thể xem thông tin hồ sơ'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quyền riêng tư hồ sơ */}
      <div className="bg-surface rounded-lg shadow-elevation-1">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary font-heading">
            Quyền riêng tư hồ sơ
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Quản lý ai có thể xem thông tin hồ sơ của bạn
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {visibilityOptions.map(option => (
              <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="profileVisibility"
                  value={option.value}
                  checked={privacySettings.profileVisibility === option.value}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">{option.label}</div>
                  <div className="text-sm text-text-secondary">{option.description}</div>
                </div>
              </label>
            ))}
          </div>

          {privacySettings.profileVisibility === 'public' && (
            <div className="mt-6 p-4 bg-primary-100 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Globe" size={20} className="text-primary mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-text-primary">URL hồ sơ công khai</h4>
                  <p className="text-sm text-text-secondary mt-1">
                    Hồ sơ của bạn có thể truy cập tại: 
                    <a href={privacySettings.publicProfileUrl} className="text-primary hover:underline ml-1">
                      {privacySettings.publicProfileUrl}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tùy chọn liên hệ */}
      <div className="bg-surface rounded-lg shadow-elevation-1">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary font-heading">
            Tùy chọn liên hệ
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Quản lý cách người khác liên hệ với bạn
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                key: 'showContactInfo',
                label: 'Hiển thị thông tin liên hệ trên hồ sơ',
                description: 'Hiển thị email và số điện thoại của bạn công khai'
              },
              {
                key: 'allowDirectContact',
                label: 'Cho phép liên hệ trực tiếp qua nền tảng',
                description: 'Người dùng khác có thể gửi tin nhắn cho bạn'
              },
              {
                key: 'showOnlineStatus',
                label: 'Hiển thị trạng thái trực tuyến',
                description: 'Hiển thị khi bạn đang hoạt động trên nền tảng'
              }
            ].map(setting => (
              <div key={setting.key} className="flex items-center justify-between">
                <div className="flex-1">
                  <label htmlFor={setting.key} className="text-sm font-medium text-text-primary">
                    {setting.label}
                  </label>
                  <p className="text-xs text-text-secondary mt-1">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id={setting.key}
                    checked={privacySettings[setting.key]}
                    onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dữ liệu & Quyền riêng tư */}
      <div className="bg-surface rounded-lg shadow-elevation-1">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary font-heading">
            Dữ liệu & Quyền riêng tư
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Quản lý cách dữ liệu của bạn được sử dụng và chia sẻ
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                key: 'showInSearchResults',
                label: 'Hiển thị trong kết quả tìm kiếm',
                description: 'Cho phép hồ sơ của bạn được tìm thấy khi tìm kiếm'
              },
              {
                key: 'allowPropertyRecommendations',
                label: 'Nhận gợi ý bất động sản cá nhân hóa',
                description: 'Sử dụng hoạt động của bạn để gợi ý các bất động sản phù hợp'
              },
              {
                key: 'shareDataWithPartners',
                label: 'Chia sẻ dữ liệu với đối tác tin cậy',
                description: 'Cho phép chia sẻ dữ liệu ẩn danh với đối tác bất động sản'
              },
              {
                key: 'allowMarketingEmails',
                label: 'Nhận email quảng cáo',
                description: 'Nhận email khuyến mãi và cập nhật từ nền tảng'
              }
            ].map(setting => (
              <div key={setting.key} className="flex items-center justify-between">
                <div className="flex-1">
                  <label htmlFor={setting.key} className="text-sm font-medium text-text-primary">
                    {setting.label}
                  </label>
                  <p className="text-xs text-text-secondary mt-1">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id={setting.key}
                    checked={privacySettings[setting.key]}
                    onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Người dùng bị chặn */}
      <div className="bg-surface rounded-lg shadow-elevation-1">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Người dùng bị chặn
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Quản lý những người không thể liên hệ với bạn
            </p>
          </div>
          <button
            onClick={() => setShowBlockUserModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Chặn người dùng
          </button>
        </div>

        <div className="p-6">
          {privacySettings.blockList.length === 0 ? (
            <div className="text-center py-6">
              <Icon name="Shield" size={48} className="text-secondary-300 mx-auto mb-4" />
              <p className="text-text-secondary">Chưa có người dùng bị chặn</p>
            </div>
          ) : (
            <div className="space-y-3">
              {privacySettings.blockList.map(blockedUser => (
                <div key={blockedUser.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{blockedUser.email}</p>
                    <p className="text-xs text-text-secondary">Bị chặn ngày {blockedUser.dateBlocked}</p>
                  </div>
                  <button
                    onClick={() => handleUnblockUser(blockedUser.id)}
                    className="text-primary hover:text-primary-700 text-sm font-medium transition-colors duration-200"
                  >
                    Bỏ chặn
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Xóa tài khoản */}
      <div className="bg-surface rounded-lg shadow-elevation-1 border-error">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-error font-heading">
            Khu vực nguy hiểm
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Hành động không thể hoàn tác ảnh hưởng đến tài khoản của bạn
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-start space-x-4">
            <Icon name="AlertTriangle" size={24} className="text-error mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-text-primary mb-2">Xóa tài khoản</h3>
              <p className="text-text-secondary text-sm mb-4">
                Xóa vĩnh viễn tài khoản và tất cả dữ liệu liên quan. Hành động này không thể hoàn tác.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-error text-white px-4 py-2 rounded-md font-medium hover:bg-error-600 transition-colors duration-200"
              >
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chặn người dùng */}
      {showBlockUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-modal flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Chặn người dùng</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="blockUserEmail" className="block text-sm font-medium text-text-primary mb-2">
                  Email người dùng
                </label>
                <input
                  type="email"
                  id="blockUserEmail"
                  value={newBlockedUser}
                  onChange={(e) => setNewBlockedUser(e.target.value)}
                  placeholder="user@example.com"
                  className="block w-full px-4 py-3 border border-border rounded-md focus:border-border-focus focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                />
              </div>
              <p className="text-sm text-text-secondary">
                Người dùng bị chặn sẽ không thể liên hệ hoặc xem hồ sơ của bạn.
              </p>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleBlockUser}
                className="flex-1 bg-error text-white px-4 py-2 rounded-md font-medium hover:bg-error-600 transition-colors duration-200"
              >
                Chặn người dùng
              </button>
              <button
                onClick={() => {
                  setShowBlockUserModal(false);
                  setNewBlockedUser('');
                }}
                className="flex-1 border border-border text-text-secondary px-4 py-2 rounded-md font-medium hover:bg-secondary-100 transition-colors duration-200"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xóa tài khoản */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-modal flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="AlertTriangle" size={24} className="text-error" />
              <h3 className="text-lg font-semibold text-text-primary">Xóa tài khoản</h3>
            </div>
            <div className="space-y-4">
              <p className="text-text-secondary">
                Bạn có chắc chắn muốn xóa tài khoản không? Hành động này sẽ:
              </p>
              <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
                <li>Xóa vĩnh viễn tất cả thông tin hồ sơ</li>
                <li>Xóa các tìm kiếm và bất động sản yêu thích</li>
                <li>Hủy tất cả các gói đăng ký đang hoạt động</li>
                <li>Xóa lịch sử tin nhắn</li>
              </ul>
              <div className="p-3 bg-error-100 rounded-lg">
                <p className="text-sm text-error font-medium">
                  Hành động này không thể hoàn tác!
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-error text-white px-4 py-2 rounded-md font-medium hover:bg-error-600 transition-colors duration-200"
              >
                Xác nhận xóa tài khoản
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
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

export default PrivacyControls;
