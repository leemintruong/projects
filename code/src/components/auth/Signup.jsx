import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const Signup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signUp } = useAuth();

  const roleOptions = [
    { value: 'buyer', label: 'Khách hàng' },
    { value: 'seller', label: 'Người bán' },
    { value: 'agent', label: 'Môi giới' }
  ];

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData?.password !== formData?.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    if (formData?.password?.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setLoading(false);
      return;
    }

    const { error } = await signUp(
      formData?.email, 
      formData?.password, 
      formData?.fullName, 
      formData?.role
    );
    
    if (error) {
      setError(error?.message);
    } else {
      setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
      setTimeout(() => {
        onClose?.();
      }, 2000);
    }
    
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Đăng Ký</h2>
        <p className="text-text-secondary mt-2">Tạo tài khoản mới để bắt đầu</p>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
          <p className="text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={16} className="mr-2" />
            {error}
          </p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-md">
          <p className="text-sm text-success flex items-center">
            <Icon name="CheckCircle" size={16} className="mr-2" />
            {success}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            name="fullName"
            placeholder="Họ và tên"
            value={formData?.fullName}
            onChange={handleChange}
            required
            disabled={loading}
            icon="User"
          />
        </div>

        <div>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData?.email}
            onChange={handleChange}
            required
            disabled={loading}
            icon="Mail"
          />
        </div>

        <div>
          <Select
            name="role"
            value={formData?.role}
            onChange={handleChange}
            options={roleOptions}
            placeholder="Chọn vai trò"
            disabled={loading}
            icon="Users"
          />
        </div>
        
        <div>
          <Input
            type="password"
            name="password"
            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
            value={formData?.password}
            onChange={handleChange}
            required
            disabled={loading}
            icon="Lock"
          />
        </div>

        <div>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={formData?.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
            icon="Lock"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              Đang đăng ký...
            </>
          ) : (
            'Đăng Ký'
          )}
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-text-secondary">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary hover:text-primary-700 font-medium">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;