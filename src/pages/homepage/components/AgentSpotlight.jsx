import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AgentSpotlight = () => {
  const [agents, setAgents] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/agents');
        const data = await res.json();
        setAgents(data);
      } catch (err) {
        console.error('Lỗi khi fetch agents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  // Auto slide every 2s
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [agents, currentSlide]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % agents.length);
    }, 2000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const goToSlide = index => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + agents.length) % agents.length);
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % agents.length);

  const renderStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++)
      stars.push(<Icon key={`full-${i}`} name="Star" size={16} className="text-warning" fill="currentColor" />);
    if (hasHalfStar)
      stars.push(<Icon key="half" name="Star" size={16} className="text-warning" fill="currentColor" />);
    for (let i = 0; i < 5 - Math.ceil(rating); i++)
      stars.push(<Icon key={`empty-${i}`} name="Star" size={16} className="text-secondary-300" />);
    return stars;
  };

  if (loading) return <p className="text-center py-10 text-gray-500">Đang tải chuyên viên...</p>;
  if (agents.length === 0) return <p className="text-center py-10 text-gray-500">Chưa có chuyên viên nào.</p>;

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-6">Gặp Gỡ Các Chuyên Viên Hàng Đầu</h2>
        <p className="text-center text-lg text-text-secondary mb-12">
          Làm việc với các chuyên gia hàng đầu cam kết giúp bạn đạt mục tiêu bất động sản
        </p>

        {/* Carousel */}
        <div
          className="relative overflow-hidden h-80"
          onMouseEnter={stopAutoSlide}
          onMouseLeave={startAutoSlide}
        >
          <div
            className="flex transition-transform duration-500 ease-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {agents.map(agent => (
              <div key={agent.id} className="w-full flex-shrink-0 h-full flex bg-white rounded-lg shadow">
                {/* Ảnh */}
                <div className="w-1/3 h-full relative">
                  <Image
                    src={agent.avatar_url}
                    alt={agent.full_name}
                    className="w-full h-full object-cover rounded-l-lg"
                  />
                  {agent.is_verified && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded-full">
                      Verified
                    </div>
                  )}
                </div>

                {/* Thông tin */}
                <div className="w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{agent.full_name}</h3>
                    <p className="text-primary font-medium mb-2">{agent.role}</p>
                    <p className="flex items-center text-text-secondary mb-2">
                      <Icon name="MapPin" size={16} className="mr-1" />
                      {agent.phone}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      {renderStars(agent.rating || 0)}
                      <span className="text-sm text-text-secondary">
                        ({agent.reviewCount || 0} đánh giá)
                      </span>
                    </div>
                    <p className="text-text-secondary">{agent.bio}</p>
                  </div>

                  {/* Liên hệ */}
                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 bg-primary text-white px-4 py-2 rounded-md flex items-center justify-center">
                      <Icon name="MessageCircle" size={16} className="inline mr-2" />
                      Nhắn tin
                    </button>
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex-1 bg-accent-100 text-accent-600 px-4 py-2 rounded-md flex items-center justify-center"
                    >
                      <Icon name="Phone" size={16} className="inline mr-2" />
                      Gọi ngay
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nút điều hướng */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow"
          >
            <Icon name="ChevronLeft" size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow"
          >
            <Icon name="ChevronRight" size={24} />
          </button>

          {/* Slide indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
            {agents.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-primary scale-110' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Xem tất cả */}
        <div className="text-center mt-8">
          <Link
            to="/agent-dashboard"
            className="inline-flex items-center px-6 py-3 bg-secondary-100 text-text-primary rounded-md font-semibold hover:bg-secondary-200"
          >
            Xem tất cả chuyên viên
            <Icon name="ArrowRight" size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AgentSpotlight;
