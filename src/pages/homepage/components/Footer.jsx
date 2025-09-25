import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const footerSections = [
    {
      title: "Dành cho Người Mua",
      links: [
        { label: "Tìm Bất Động Sản", path: "/property-listings" },
        { label: "Công Cụ Tính Vay", path: "/mortgage-calculator" },
        { label: "Hướng Dẫn Người Mua", path: "/buyers-guide" },
        { label: "Thông Tin Khu Vực", path: "/neighborhoods" }
      ]
    },
    {
      title: "Dành cho Người Bán",
      links: [
        { label: "Đăng Bất Động Sản", path: "/list-property" },
        { label: "Định Giá Nhà", path: "/home-valuation" },
        { label: "Hướng Dẫn Người Bán", path: "/sellers-guide" },
        { label: "Báo Cáo Thị Trường", path: "/market-reports" }
      ]
    },
    {
      title: "Dành cho Đại Lý",
      links: [
        { label: "Bảng Điều Khiển Đại Lý", path: "/agent-dashboard" },
        { label: "Tham Gia Nhóm Chúng Tôi", path: "/join-team" },
        { label: "Tài Nguyên Đại Lý", path: "/agent-resources" },
        { label: "Trung Tâm Đào Tạo", path: "/training" }
      ]
    },
    {
      title: "Công Ty",
      links: [
        { label: "Về Chúng Tôi", path: "/about" },
        { label: "Liên Hệ", path: "/contact" },
        { label: "Tuyển Dụng", path: "/careers" },
        { label: "Báo Chí", path: "/press" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", url: "https://facebook.com" },
    { name: "Twitter", icon: "Twitter", url: "https://twitter.com" },
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com" },
    { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com" }
  ];

  const handleSubscribe = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setMessage('Vui lòng nhập email hợp lệ.');
      return;
    }
    setMessage('Đăng ký thành công!');
    setEmail('');
  };

  return (
    <footer className="bg-secondary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Nội dung chính Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Thông tin công ty */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <Icon name="Home" size={20} color="white" />
                </div>
                <span className="text-xl font-semibold font-heading">BĐS VIỆT</span>
              </div>
              <p className="text-secondary-300 mb-6 leading-relaxed">
                Đối tác uy tín của bạn trong lĩnh vực bất động sản. Chúng tôi kết nối người mua, người bán và đại lý để tạo ra các giao dịch thành công trên toàn quốc.
              </p>
              
              {/* Thông tin liên hệ */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2 text-secondary-300">
                  <Icon name="Phone" size={16} />
                  <span>+84 123 456 789</span>
                </div>
                <div className="flex items-center space-x-2 text-secondary-300">
                  <Icon name="Mail" size={16} />
                  <span>info@bdsviet.com</span>
                </div>
                <div className="flex items-center space-x-2 text-secondary-300">
                  <Icon name="MapPin" size={16} />
                  <span>123 Đường Bất Động Sản, Hà Nội, Việt Nam</span>
                </div>
              </div>

              {/* Liên kết mạng xã hội */}
              <div className="flex space-x-4">
                {socialLinks?.map((social) => (
                  <a
                    key={social?.name}
                    href={social?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-secondary-600 rounded-full flex items-center justify-center
                               hover:bg-primary transition-all duration-200 ease-out"
                    aria-label={`Theo dõi chúng tôi trên ${social?.name}`}
                  >
                    <Icon name={social?.icon} size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Các link Footer */}
            {footerSections?.map((section) => (
              <div key={section?.title}>
                <h3 className="text-lg font-semibold mb-4 text-white">{section?.title}</h3>
                <ul className="space-y-2">
                  {section?.links?.map((link) => (
                    <li key={link?.label}>
                      <Link
                        to={link?.path}
                        className="text-secondary-300 hover:text-white transition-colors duration-200"
                        aria-label={link?.label}
                      >
                        {link?.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter đăng ký */}
        <div className="py-8 border-t border-secondary-600">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-lg font-semibold mb-2">Nhận Cập Nhật</h3>
              <p className="text-secondary-300">
                Nhận thông tin mới nhất về bất động sản và thị trường qua email.
              </p>
              {message && (
                <p className="text-sm mt-1 text-success">{message}</p>
              )}
            </div>
            <div className="flex w-full lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                aria-label="Email của bạn"
                className="flex-1 lg:w-64 px-4 py-2 bg-secondary-600 border border-secondary-500 
                           rounded-l-md text-white placeholder-secondary-300
                           focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleSubscribe}
                className="px-6 py-2 bg-primary text-white rounded-r-md font-medium hover:bg-primary-700 transition-all duration-200 ease-out"
              >
                Đăng Ký
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-secondary-600">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-secondary-300 text-sm mb-4 md:mb-0">
              © {currentYear} BĐS VIỆT. Bảo lưu mọi quyền.
            </div>
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-secondary-300 hover:text-white transition-colors duration-200">Chính Sách Bảo Mật</Link>
              <Link to="/terms" className="text-secondary-300 hover:text-white transition-colors duration-200">Điều Khoản Dịch Vụ</Link>
              <Link to="/cookies" className="text-secondary-300 hover:text-white transition-colors duration-200">Chính Sách Cookie</Link>
              <Link to="/accessibility" className="text-secondary-300 hover:text-white transition-colors duration-200">Khả Năng Truy Cập</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
