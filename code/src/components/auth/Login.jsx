import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error?.message);
    } else {
      onClose?.();
    }
    
    setLoading(false);
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');

    const { error } = await signIn(demoEmail, demoPassword);
    
    if (error) {
      setError(error?.message);
    } else {
      onClose?.();
    }
    
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Đăng Nhập</h2>
        <p className="text-text-secondary mt-2">Chào mừng bạn trở lại!</p>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
          <p className="text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={16} className="mr-2" />
            {error}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e?.target?.value)}
            required
            disabled={loading}
            icon="Mail"
          />
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e?.target?.value)}
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
              Đang đăng nhập...
            </>
          ) : (
            'Đăng Nhập'
          )}
        </Button>
      </form>
      {/* Demo Credentials Section */}
      <div className="mt-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
        <h3 className="text-sm font-medium text-text-primary mb-3">
          <Icon name="Info" size={16} className="inline mr-1" />
          Tài khoản demo:
        </h3>
        <div className="space-y-2 text-sm">
          <button
            type="button"
            onClick={() => handleDemoLogin('admin@batdongsan.vn', 'admin123')}
            disabled={loading}
            className="w-full text-left p-2 bg-white rounded border hover:bg-primary/5 transition-colors disabled:opacity-50"
          >
            <span className="font-medium text-primary">Quản trị:</span> admin@batdongsan.vn / admin123
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('agent1@batdongsan.vn', 'agent123')}
            disabled={loading}
            className="w-full text-left p-2 bg-white rounded border hover:bg-primary/5 transition-colors disabled:opacity-50"
          >
            <span className="font-medium text-success">Môi giới:</span> agent1@batdongsan.vn / agent123
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('buyer@batdongsan.vn', 'buyer123')}
            disabled={loading}
            className="w-full text-left p-2 bg-white rounded border hover:bg-primary/5 transition-colors disabled:opacity-50"
          >
            <span className="font-medium text-info">Khách hàng:</span> buyer@batdongsan.vn / buyer123
          </button>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-text-secondary">
          Chưa có tài khoản?{' '}
          <Link to="/signup" className="text-primary hover:text-primary-700 font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;