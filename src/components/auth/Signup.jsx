import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Signup = ({ onClose }) => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user, error: signError } = await signUp(fullName, email, password, role);
      if (signError) {
        setError(signError.message || 'Đăng ký thất bại');
      } else {
        onClose?.();
      }
    } catch (err) {
      setError('Lỗi server, thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Đăng Ký</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Họ và tên"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="buyer">Người mua</option>
          <option value="seller">Người bán</option>
        </select>
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
        </Button>
      </form>
    </div>
  );
};

export default Signup;
