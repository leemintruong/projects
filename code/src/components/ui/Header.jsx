import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import Login from '../auth/Login';
import Signup from '../auth/Signup';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Mock user data - in real app this would come from context/props
  const user = {
    isAuthenticated: true,
    role: 'agent', // 'buyer', 'seller', 'agent\'name: \'Nguyễn Văn An',
    avatar: '/assets/images/avatar.jpg'
  };

  const navigationItems = [
    {
      label: 'Tìm Bất Động Sản',
      path: '/property-listings',
      icon: 'Search',
      roles: ['all']
    },
    {
      label: 'Bảng Điều Khiển',
      path: '/agent-dashboard',
      icon: 'LayoutDashboard',
      roles: ['agent']
    }
  ];

  const userMenuItems = [
    {
      label: 'Hồ Sơ & Cài Đặt',
      path: '/user-profile-settings',
      icon: 'User'
    },
    {
      label: 'Bất Động Sản Đã Lưu',
      path: '/saved-properties',
      icon: 'Heart'
    },
    {
      label: 'Đăng Xuất',
      action: 'logout',
      icon: 'LogOut'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef?.current && !mobileMenuRef?.current?.contains(event?.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location?.pathname]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      // Navigate to property listings with search query
      window.location.href = `/property-listings?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleUserAction = (action) => {
    if (action === 'logout') {
      // Handle logout logic
      console.log('Logging out...');
    }
    setIsUserMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const shouldShowNavItem = (roles) => {
    return roles?.includes('all') || roles?.includes(user?.role);
  };

  const AuthModal = ({ isOpen, onClose, mode }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              {mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
          <div className="p-6">
            {mode === 'login' ? <Login onClose={onClose} /> : <Signup onClose={onClose} />}
          </div>
        </div>
      </div>
    );
  };

  const UserAccountMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const { user, userProfile, signOut } = useAuth();
    const menuRef = useRef(null);

    // ... keep existing useEffect and click outside logic ...

    const handleSignOut = async () => {
      await signOut();
      setIsOpen(false);
    };

    const openAuthModal = (mode) => {
      setAuthMode(mode);
      setShowAuthModal(true);
      setIsOpen(false);
    };

    if (!user) {
      return (
        <>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Đăng Ký
            </button>
          </div>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            mode={authMode}
          />
        </>
      );
    }

    // ... keep existing authenticated user menu JSX ...

    return (
      <>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary-100 transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile?.avatar_url}
                  alt={userProfile?.full_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <Icon name="User" size={16} className="text-white" />
              )}
            </div>
            <span className="text-sm font-medium text-text-primary hidden sm:block">
              {userProfile?.full_name || user?.email}
            </span>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-border z-10">
              <div className="py-1">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">
                    {userProfile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-text-secondary">{user?.email}</p>
                  <p className="text-xs text-primary capitalize">
                    {userProfile?.role || 'buyer'}
                  </p>
                </div>
                
                <Link
                  to="/user-profile-settings"
                  className="flex items-center px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon name="User" size={16} className="mr-3" />
                  Thông Tin Cá Nhân
                </Link>
                
                {(userProfile?.role === 'agent' || userProfile?.role === 'admin') && (
                  <Link
                    to="/agent-dashboard"
                    className="flex items-center px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon name="BarChart3" size={16} className="mr-3" />
                    Dashboard
                  </Link>
                )}
                
                <Link
                  to="/user-profile-settings"
                  className="flex items-center px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon name="Heart" size={16} className="mr-3" />
                  Yêu Thích
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/5"
                >
                  <Icon name="LogOut" size={16} className="mr-3" />
                  Đăng Xuất
                </button>
              </div>
            </div>
          )}
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
        />
      </>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/homepage" 
              className="flex items-center space-x-2 micro-interaction"
              aria-label="BDS Việt - Về trang chủ"
            >
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="Home" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary font-heading">
                BDS Việt
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon 
                    name="Search" 
                    size={20} 
                    className={`transition-colors duration-200 ${
                      isSearchFocused ? 'text-primary' : 'text-secondary'
                    }`}
                  />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Tìm bất động sản theo vị trí, loại hình hoặc giá..."
                  className="block w-full pl-10 pr-4 py-2 border border-border rounded-md 
                           focus:border-border-focus focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
                           transition-all duration-200 ease-out bg-background text-text-primary
                           placeholder-text-secondary"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems?.map((item) => (
              shouldShowNavItem(item?.roles) && (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium 
                           transition-all duration-200 ease-out micro-interaction
                           ${isActiveRoute(item?.path)
                             ? 'bg-primary-100 text-primary border border-primary-500' :'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                           }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </Link>
              )
            ))}
          </nav>

          {/* User Menu & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {user?.isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary-100 transition-all duration-200 ease-out micro-interaction"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                    </span>
                  </div>
                  <Icon 
                    name="ChevronDown" 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface rounded-md shadow-elevation-3 
                                border border-border z-dropdown">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                      <p className="text-xs text-text-secondary capitalize">
                        {user?.role === 'agent' ? 'Môi giới' : 
                         user?.role === 'buyer' ? 'Người mua' : 'Người bán'}
                      </p>
                    </div>
                    <div className="py-1">
                      {userMenuItems?.map((item) => (
                        <div key={item?.label}>
                          {item?.path ? (
                            <Link
                              to={item?.path}
                              className="flex items-center space-x-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-100 transition-colors duration-200"
                            >
                              <Icon name={item?.icon} size={16} />
                              <span>{item?.label}</span>
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleUserAction(item?.action)}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-100 transition-colors duration-200"
                            >
                              <Icon name={item?.icon} size={16} />
                              <span>{item?.label}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary 
                           transition-colors duration-200"
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium 
                           hover:bg-primary-700 transition-all duration-200 ease-out micro-interaction"
                >
                  Bắt Đầu
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-secondary-100 transition-all duration-200 ease-out"
              aria-expanded={isMobileMenuOpen}
              aria-label="Chuyển menu di động"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Search" size={20} className="text-secondary" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                placeholder="Tìm bất động sản..."
                className="block w-full pl-10 pr-4 py-2 border border-border rounded-md 
                         focus:border-border-focus focus:ring-2 focus:ring-primary-500 
                         transition-all duration-200 ease-out bg-background text-text-primary
                         placeholder-text-secondary"
              />
            </div>
          </form>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden bg-surface border-t border-border z-mobile-menu"
        >
          <div className="px-4 py-3 space-y-1">
            {navigationItems?.map((item) => (
              shouldShowNavItem(item?.roles) && (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium 
                           transition-all duration-200 ease-out
                           ${isActiveRoute(item?.path)
                             ? 'bg-primary-100 text-primary border border-primary-500' :'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                           }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;