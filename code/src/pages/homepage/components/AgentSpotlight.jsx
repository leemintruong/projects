import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AgentSpotlight = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  const topAgents = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Chuyên viên Bất động sản Cao cấp",
      photo: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 4.9,
      reviewCount: 127,
      salesCount: 89,
      specialties: ["Nhà sang trọng", "Người mua lần đầu"],
      location: "Manhattan, NY",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@estatehub.com",
      bio: `Sarah đã giúp các gia đình tìm nhà mơ ước tại Manhattan hơn 8 năm qua. Chuyên môn về bất động sản cao cấp và sự tận tâm với khách hàng đã giúp cô nhận nhiều giải thưởng uy tín.`,
      achievements: ["Top 1% Chuyên viên 2023", "Giải Khách hàng Lựa chọn", "Chuyên gia Luxury"]
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Chuyên gia Bất động sản",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4.8,
      reviewCount: 94,
      salesCount: 67,
      specialties: ["Bất động sản đầu tư", "Bất động sản thương mại"],
      location: "Austin, TX",
      phone: "+1 (555) 234-5678",
      email: "michael.chen@estatehub.com",
      bio: `Michael chuyên về bất động sản đầu tư và đã giúp nhiều khách hàng xây dựng danh mục bất động sản thành công. Phương pháp phân tích và kiến thức thị trường khiến anh trở thành cố vấn tin cậy.`,
      achievements: ["Chuyên gia Đầu tư 2023", "Ngôi sao mới nổi", "Chuyên viên Phân tích Thị trường"]
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      title: "Tư vấn Bất động sản Cao cấp",
      photo: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5.0,
      reviewCount: 156,
      salesCount: 112,
      specialties: ["Bất động sản ven biển", "Căn hộ sang trọng"],
      location: "Miami, FL",
      phone: "+1 (555) 345-6789",
      email: "elena.rodriguez@estatehub.com",
      bio: `Elena là chuyên gia bất động sản cao cấp tại Miami, chuyên về các khu biệt thự ven biển và căn hộ cao cấp. Kỹ năng song ngữ và am hiểu văn hóa giúp phục vụ đa dạng khách hàng.`,
      achievements: ["Lãnh đạo Luxury 2023", "Chuyên gia đa ngôn ngữ", "Chuyên gia BĐS ven biển"]
    },
    {
      id: 4,
      name: "David Kim",
      title: "Chuyên gia Bán nhà dân cư",
      photo: "https://randomuser.me/api/portraits/men/33.jpg",
      rating: 4.7,
      reviewCount: 83,
      salesCount: 54,
      specialties: ["Nhà gia đình", "Bất động sản thân thiện môi trường"],
      location: "Portland, OR",
      phone: "+1 (555) 456-7890",
      email: "david.kim@estatehub.com",
      bio: `David tập trung vào các bất động sản bền vững và thân thiện với gia đình tại Portland. Cam kết với môi trường và cộng đồng giúp anh được khách hàng eco-conscious tin tưởng.`,
      achievements: ["Chuyên gia Xây dựng Xanh", "Người bảo vệ Gia đình", "Lãnh đạo Cộng đồng"]
    }
  ];

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % topAgents.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + topAgents.length) % topAgents.length);
  const goToSlide = (index) => setCurrentSlide(index);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++)
      stars.push(<Icon key={i} name="Star" size={16} className="text-warning" fill="currentColor" />);
    if (hasHalfStar)
      stars.push(<Icon key="half" name="Star" size={16} className="text-warning" fill="currentColor" />);
    for (let i = 0; i < 5 - Math.ceil(rating); i++)
      stars.push(<Icon key={`empty-${i}`} name="Star" size={16} className="text-secondary-300" />);
    return stars;
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-heading">
            Gặp Gỡ Các Chuyên Viên Hàng Đầu
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Làm việc với các chuyên gia hàng đầu cam kết giúp bạn đạt mục tiêu bất động sản
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={carouselRef}>
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {topAgents.map(agent => (
                <div key={agent.id} className="w-full flex-shrink-0">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-surface rounded-lg shadow-elevation-2 overflow-hidden">
                      <div className="md:flex">
                        {/* Ảnh */}
                        <div className="md:w-1/3">
                          <div className="h-64 md:h-full relative">
                            <Image src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                        </div>

                        {/* Thông tin */}
                        <div className="md:w-2/3 p-6 lg:p-8">
                          <div className="flex flex-col h-full">
                            <div className="mb-4">
                              <h3 className="text-2xl font-bold text-text-primary mb-1">{agent.name}</h3>
                              <p className="text-primary font-medium mb-2">{agent.title}</p>
                              <p className="text-text-secondary flex items-center">
                                <Icon name="MapPin" size={16} className="mr-1" />
                                {agent.location}
                              </p>
                            </div>

                            {/* Đánh giá & Thống kê */}
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div className="flex items-center space-x-1">
                                {renderStars(agent.rating)}
                                <span className="ml-2 text-sm text-text-secondary">
                                  {agent.rating} ({agent.reviewCount} đánh giá)
                                </span>
                              </div>
                              <div className="text-sm text-text-secondary">
                                <span className="font-semibold text-text-primary">{agent.salesCount}</span> giao dịch
                              </div>
                            </div>

                            {/* Chuyên môn */}
                            <div className="mb-4">
                              <p className="text-sm font-medium text-text-primary mb-2">Chuyên môn:</p>
                              <div className="flex flex-wrap gap-2">
                                {agent.specialties.map(spec => (
                                  <span key={spec} className="px-3 py-1 bg-primary-100 text-primary text-xs rounded-full">
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Giới thiệu */}
                            <div className="mb-6 flex-grow">
                              <p className="text-text-secondary leading-relaxed">{agent.bio}</p>
                            </div>

                            {/* Thành tích */}
                            <div className="mb-6">
                              <p className="text-sm font-medium text-text-primary mb-2">Thành tích:</p>
                              <div className="flex flex-wrap gap-2">
                                {agent.achievements.map(a => (
                                  <span key={a} className="px-2 py-1 bg-success-100 text-success text-xs rounded">
                                    <Icon name="Award" size={12} className="inline mr-1" />
                                    {a}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Liên hệ */}
                            <div className="flex flex-col sm:flex-row gap-3">
                              <button className="flex-1 bg-primary text-white px-4 py-2 rounded-md font-medium
                                               hover:bg-primary-700 transition-all duration-200 ease-out micro-interaction">
                                <Icon name="MessageCircle" size={16} className="inline mr-2" />
                                Nhắn tin
                              </button>
                              <a href={`tel:${agent.phone}`} className="flex-1 bg-accent-100 text-accent-600 px-4 py-2 rounded-md font-medium hover:bg-accent-500 hover:text-white transition-all duration-200 ease-out micro-interaction flex items-center justify-center">
                                <Icon name="Phone" size={16} className="inline mr-2" />
                                Gọi ngay
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nút điều hướng */}
          <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-surface rounded-full shadow-elevation-2 flex items-center justify-center hover:bg-secondary-100 transition-all duration-200 ease-out micro-interaction" aria-label="Agent trước">
            <Icon name="ChevronLeft" size={24} className="text-text-primary" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-surface rounded-full shadow-elevation-2 flex items-center justify-center hover:bg-secondary-100 transition-all duration-200 ease-out micro-interaction" aria-label="Agent tiếp theo">
            <Icon name="ChevronRight" size={24} className="text-text-primary" />
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {topAgents.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide ? 'bg-primary scale-110' : 'bg-secondary-300 hover:bg-secondary-400'}`}
                aria-label={`Đi tới agent ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Xem tất cả agent */}
        <div className="text-center mt-12">
          <Link to="/agent-dashboard" className="inline-flex items-center px-8 py-3 bg-secondary-100 text-text-primary rounded-md font-semibold hover:bg-secondary-200 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 transition-all duration-200 ease-out micro-interaction">
            Xem tất cả chuyên viên
            <Icon name="ArrowRight" size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AgentSpotlight;
