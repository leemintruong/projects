import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import Icon from '../AppIcon';

const Header = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const userMenuRef = useRef(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    signOut();
    setIsUserMenuOpen(false);
  };

  const AuthModal = () => {
    if (!showAuthModal) return null;
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg relative">
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Icon name="X" size={20} />
          </button>
          {authMode === 'login' ? (
            <Login onClose={() => setShowAuthModal(false)} />
          ) : (
            <Signup onClose={() => setShowAuthModal(false)} />
          )}
        </div>
      </div>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition">
          BDS Việt
        </Link>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              >
                <span className="font-medium">{user.fullName}</span>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg p-2 space-y-2">
                  <p className="text-sm font-semibold">{user.fullName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-primary capitalize">{user.role}</p>
                  <div className="border-t border-gray-200 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-red-500 hover:bg-red-50 rounded px-2 py-1 transition"
                    >
                      Đăng Xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 text-sm text-gray-700 hover:text-primary transition"
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
              >
                Bắt Đầu
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthModal />
    </header>
  );
};

export default Header;
