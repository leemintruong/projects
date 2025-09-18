import React, { useState, useEffect } from 'react';
import SearchInterface from '../../../components/ui/SearchInterface';
import Image from '../../../components/AppImage';

const HeroSection = ({ onSearch }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      alt: "Căn hộ hiện đại tại Thành phố Hồ Chí Minh"
    },
    {
      url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      alt: "Biệt thự đẹp tại Hà Nội"
    },
    {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      alt: "Nhà phố hiện đại tại Đà Nẵng"
    }
  ];

  // Tự động chuyển slide mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center text-white mb-8 lg:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 font-heading">
              Tìm Ngôi Nhà Mơ Ước Của Bạn
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Khám phá căn hộ hoàn hảo từ hàng nghìn bất động sản trên khắp Việt Nam. Ngôi nhà tiếp theo của bạn chỉ cách một cú tìm kiếm.
            </p>
          </div>

          {/* Search Interface */}
          <div className="max-w-4xl mx-auto">
            <SearchInterface variant="hero" onSearch={onSearch} />
          </div>

          {/* Quick Search Tags */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              'Căn hộ TP.HCM',
              'Nhà dưới 5 tỷ',
              'Biệt thự cao cấp',
              'Nhà cho thuê thú cưng',
              'Bất động sản ven biển'
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => onSearch({ query: tag })}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm
                           hover:bg-white/30 transition-all duration-200 ease-out border border-white/30"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-white scale-110'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Chuyển đến slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
