// src/pages/user-profile-settings/components/PaymentMethods.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PaymentMethods = ({ user, onDataChange }) => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'credit_card',
      cardType: 'visa',
      lastFour: '4242',
      expiryMonth: '12',
      expiryYear: '2025',
      cardholderName: 'Nguyễn Văn A',
      isDefault: true,
      billingAddress: {
        street: '123 Đường Chính',
        city: 'Hà Nội',
        state: 'HN',
        zipCode: '100000',
        country: 'VN'
      }
    },
    {
      id: '2',
      type: 'credit_card',
      cardType: 'mastercard',
      lastFour: '8888',
      expiryMonth: '06',
      expiryYear: '2026',
      cardholderName: 'Nguyễn Văn A',
      isDefault: false,
      billingAddress: {
        street: '456 Đường Oak',
        city: 'Hồ Chí Minh',
        state: 'HCM',
        zipCode: '700000',
        country: 'VN'
      }
    }
  ]);

  const [subscriptions, setSubscriptions] = useState([
    {
      id: '1',
      name: 'Gói Premium Agent',
      price: '1.200.000₫',
      billingCycle: 'hàng tháng',
      status: 'active',
      nextBilling: '2024-02-15',
      features: ['Đăng tin không giới hạn', 'Hỗ trợ ưu tiên', 'Báo cáo phân tích nâng cao', 'Quản lý khách hàng tiềm năng']
    }
  ]);

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'VN'
    }
  });

  const billingHistory = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Gói Premium Agent - Hàng tháng',
      amount: '1.200.000₫',
      status: 'paid',
      paymentMethod: '•••• 4242'
    },
    {
      id: '2',
      date: '2023-12-15',
      description: 'Gói Premium Agent - Hàng tháng',
      amount: '1.200.000₫',
      status: 'paid',
      paymentMethod: '•••• 4242'
    },
    {
      id: '3',
      date: '2023-11-15',
      description: 'Gói Premium Agent - Hàng tháng',
      amount: '1.200.000₫',
      status: 'paid',
      paymentMethod: '•••• 4242'
    }
  ];

  const handleSetDefault = (cardId) => {
    setPaymentMethods(prev => 
      prev?.map(card => ({
        ...card,
        isDefault: card?.id === cardId
      }))
    );
    onDataChange?.();
  };

  const handleRemoveCard = (cardId) => {
    if (window.confirm('Bạn có chắc muốn xóa phương thức thanh toán này không?')) {
      setPaymentMethods(prev => prev?.filter(card => card?.id !== cardId));
      onDataChange?.();
    }
  };

  const handleCancelSubscription = (subscriptionId) => {
    if (window.confirm('Bạn có chắc muốn hủy đăng ký này không? Bạn sẽ mất quyền truy cập vào các tính năng premium sau kỳ thanh toán hiện tại.')) {
      setSubscriptions(prev => 
        prev?.map(sub => 
          sub?.id === subscriptionId 
            ? { ...sub, status: 'cancelled' }
            : sub
        )
      );
      onDataChange?.();
    }
  };

  const handleAddCard = () => {
    const cardType = newCard?.cardNumber?.startsWith('4') ? 'visa' : 'mastercard';
    const newPaymentMethod = {
      id: Date.now()?.toString(),
      type: 'credit_card',
      cardType,
      lastFour: newCard?.cardNumber?.slice(-4),
      expiryMonth: newCard?.expiryMonth,
      expiryYear: newCard?.expiryYear,
      cardholderName: newCard?.cardholderName,
      isDefault: paymentMethods?.length === 0,
      billingAddress: newCard?.billingAddress
    };
    
    setPaymentMethods(prev => [...prev, newPaymentMethod]);
    setShowAddCardModal(false);
    setNewCard({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      billingAddress: { street: '', city: '', state: '', zipCode: '', country: 'VN' }
    });
    onDataChange?.();
  };

  const getCardIcon = (cardType) => 'CreditCard';
  const getCardColor = (cardType) => cardType === 'visa' ? 'bg-blue-500' : 'bg-red-500';

  return (
    <div className="space-y-6">
      {/* Phương thức thanh toán */}
      <div className="bg-surface rounded-lg shadow-elevation-1">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary font-heading">
                Phương thức thanh toán
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Quản lý các phương thức thanh toán đã lưu
              </p>
            </div>
            <button
              onClick={() => setShowAddCardModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Icon name="Plus" size={16} />
              <span>Thêm Thẻ</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {paymentMethods?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="CreditCard" size={48} className="text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">Chưa có phương thức thanh toán</h3>
              <p className="text-text-secondary mb-4">
                Thêm phương thức thanh toán để quản lý đăng ký và tính năng premium.
              </p>
              <button
                onClick={() => setShowAddCardModal(true)}
                className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                Thêm Thẻ Đầu Tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods?.map((card) => (
                <div key={card?.id} className="border border-border rounded-lg p-4 relative">
                  {card?.isDefault && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-success text-white px-2 py-1 rounded-full text-xs font-medium">
                        Mặc định
                      </span>
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-8 ${getCardColor(card?.cardType)} rounded flex items-center justify-center`}>
                      <Icon name={getCardIcon(card?.cardType)} size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-text-primary capitalize">
                          {card?.cardType}
                        </span>
                        <span className="text-sm text-text-secondary">
                          •••• {card?.lastFour}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">
                        Hết hạn {card?.expiryMonth}/{card?.expiryYear}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {card?.cardholderName}
                      </p>
                      <div className="flex items-center space-x-3 mt-3">
                        {!card?.isDefault && (
                          <button
                            onClick={() => handleSetDefault(card?.id)}
                            className="text-primary hover:text-primary-700 text-sm font-medium transition-colors duration-200"
                          >
                            Đặt làm Mặc định
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveCard(card?.id)}
                          className="text-error hover:text-error-600 text-sm font-medium transition-colors duration-200"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gói đăng ký */}
      <div className="bg-surface rounded-lg shadow-elevation-1">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary font-heading">
            Gói đăng ký
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Quản lý các gói đăng ký premium
          </p>
        </div>
        <div className="p-6">
          {subscriptions?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Package" size={48} className="text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">Chưa có đăng ký</h3>
              <p className="text-text-secondary">
                Nâng cấp lên gói premium để sử dụng tính năng nâng cao.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions?.map((subscription) => (
                <div key={subscription?.id} className="border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-text-primary">{subscription?.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscription?.status === 'active' ? 'bg-success-100 text-success' 
                            : subscription?.status === 'cancelled' ? 'bg-error-100 text-error' : 'bg-warning-100 text-warning'
                        }`}>
                          {subscription?.status === 'active' ? 'Đang hoạt động' 
                            : subscription?.status === 'cancelled' ? 'Đã hủy' : subscription?.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-text-primary">Giá:</span>
                          <span className="text-sm text-text-secondary ml-2">{subscription?.price} / {subscription?.billingCycle}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-text-primary">Kỳ thanh toán tiếp theo:</span>
                          <span className="text-sm text-text-secondary ml-2">{subscription?.nextBilling}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-text-primary">Trạng thái:</span>
                          <span className="text-sm text-text-secondary ml-2 capitalize">{subscription?.status}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-text-primary">Tính năng:</span>
                        <ul className="text-sm text-text-secondary mt-1 list-disc list-inside">
                          {subscription?.features?.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <button className="text-primary hover:text-primary-700 text-sm font-medium transition-colors duration-200">
                        Chỉnh sửa
                      </button>
                      {subscription?.status === 'active' && (
                        <button
                          onClick={() => handleCancelSubscription(subscription?.id)}
                          className="text-error hover:text-error-600 text-sm font-medium transition-colors duration-200"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lịch sử thanh toán */}
      <div className="bg-surface rounded-lg shadow-elevation-1">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary font-heading">Lịch sử thanh toán</h2>
              <p className="text-sm text-text-secondary mt-1">Xem lịch sử thanh toán và tải hóa đơn</p>
            </div>
            <button
              onClick={() => setShowBillingHistory(!showBillingHistory)}
              className="text-primary hover:text-primary-700 text-sm font-medium transition-colors duration-200"
            >
              {showBillingHistory ? 'Ẩn' : 'Hiển thị'}
            </button>
          </div>
        </div>

        {showBillingHistory && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-text-primary">Ngày</th>
                    <th className="text-left py-3 text-sm font-medium text-text-primary">Mô tả</th>
                    <th className="text-left py-3 text-sm font-medium text-text-primary">Số tiền</th>
                    <th className="text-left py-3 text-sm font-medium text-text-primary">Phương thức thanh toán</th>
                    <th className="text-left py-3 text-sm font-medium text-text-primary">Trạng thái</th>
                    <th className="text-left py-3 text-sm font-medium text-text-primary">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory?.map((transaction) => (
                    <tr key={transaction?.id} className="border-b border-border">
                      <td className="py-3 text-sm text-text-secondary">{transaction?.date}</td>
                      <td className="py-3 text-sm text-text-primary">{transaction?.description}</td>
                      <td className="py-3 text-sm font-medium text-text-primary">{transaction?.amount}</td>
                      <td className="py-3 text-sm text-text-secondary">{transaction?.paymentMethod}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction?.status === 'paid' ? 'bg-success-100 text-success' : 'bg-error-100 text-error'
                        }`}>
                          {transaction?.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </td>
                      <td className="py-3">
                        <button className="text-primary hover:text-primary-700 text-sm font-medium transition-colors duration-200">
                          Tải xuống
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Thêm Thẻ */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-modal flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-6">Thêm Phương thức thanh toán</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Số thẻ</label>
                <input
                  type="text"
                  value={newCard?.cardNumber}
                  onChange={(e) => setNewCard(prev => ({ ...prev, cardNumber: e?.target?.value }))}
                  placeholder="1234 5678 9012 3456"
                  className="block w-full px-4 py-3 border border-border rounded-md focus:border-border-focus focus:ring focus:ring-primary-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Tháng hết hạn</label>
                  <input
                    type="text"
                    value={newCard?.expiryMonth}
                    onChange={(e) => setNewCard(prev => ({ ...prev, expiryMonth: e?.target?.value }))}
                    placeholder="MM"
                    className="block w-full px-4 py-3 border border-border rounded-md focus:border-border-focus focus:ring focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Năm hết hạn</label>
                  <input
                    type="text"
                    value={newCard?.expiryYear}
                    onChange={(e) => setNewCard(prev => ({ ...prev, expiryYear: e?.target?.value }))}
                    placeholder="YYYY"
                    className="block w-full px-4 py-3 border border-border rounded-md focus:border-border-focus focus:ring focus:ring-primary-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">CVV</label>
                <input
                  type="text"
                  value={newCard?.cvv}
                  onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e?.target?.value }))}
                  placeholder="123"
                  className="block w-full px-4 py-3 border border-border rounded-md focus:border-border-focus focus:ring focus:ring-primary-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Tên chủ thẻ</label>
                <input
                  type="text"
                  value={newCard?.cardholderName}
                  onChange={(e) => setNewCard(prev => ({ ...prev, cardholderName: e?.target?.value }))}
                  placeholder="Nguyễn Văn A"
                  className="block w-full px-4 py-3 border border-border rounded-md focus:border-border-focus focus:ring focus:ring-primary-100"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowAddCardModal(false)}
                  className="bg-border text-text-primary px-4 py-2 rounded-md hover:bg-border-hover transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddCard}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
                >
                  Thêm thẻ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
