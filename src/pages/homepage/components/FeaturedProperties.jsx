import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import propertyService from '../../../services/propertyService';
import { useAuth } from '../../../contexts/AuthContext';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await propertyService.getFeaturedProperties(); // trả về mảng
      setProperties(data || []);
    } catch (err) {
      console.error(err);
      setError('Lỗi khi tải danh sách bất động sản nổi bật');
    }

    setLoading(false);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const handleSaveProperty = async (propertyId) => {
    if (!user) {
      setError('Vui lòng đăng nhập để lưu bất động sản yêu thích');
      return;
    }

    const isCurrentlySaved = savedProperties.has(propertyId);

    if (isCurrentlySaved) {
      const { error } = await propertyService.removeFromFavorites(propertyId, user.id);
      if (!error) {
        setSavedProperties(prev => {
          const newSaved = new Set(prev);
          newSaved.delete(propertyId);
          return newSaved;
        });
      }
    } else {
      const { error } = await propertyService.addToFavorites(propertyId, user.id);
      if (!error) {
        setSavedProperties(prev => {
          const newSaved = new Set(prev);
          newSaved.add(propertyId);
          return newSaved;
        });
      }
    }
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <p className="text-center text-gray-500">Đang tải danh sách bất động sản nổi bật...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <p className="text-center text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-heading">
            Bất Động Sản Nổi Bật
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Khám phá những bất động sản được lựa chọn kỹ càng từ các vị trí đắc địa nhất trên khắp Việt Nam
          </p>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {properties.map((property, index) => {
            const primaryImage = property.property_images?.find(img => img.is_primary) || property.property_images?.[0];
            const location = `${property.districts?.name || ''}, ${property.provinces?.name || ''}`;

            return (
              <div key={property.id || index} className="bg-surface rounded-lg overflow-hidden shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-300 ease-out micro-interaction group">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <Image
                    src={primaryImage?.image_url || '/placeholder.png'}
                    alt={primaryImage?.alt_text || property.title || 'Bất động sản'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleSaveProperty(property.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200
                      ${savedProperties.has(property.id) ? 'bg-error text-white' : 'bg-white/90 text-text-secondary hover:bg-white hover:text-error'}`}
                    aria-label={savedProperties.has(property.id) ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Icon name="Heart" size={16} fill={savedProperties.has(property.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="p-4 lg:p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                    {property.title || 'Bất động sản'}
                  </h3>
                  <p className="text-text-secondary text-sm flex items-center">
                    <Icon name="MapPin" size={14} className="mr-1" />
                    {location}
                  </p>
                  <p className="text-2xl font-bold text-primary">{formatPrice(property.price || 0)}</p>
                </div>
              </div>
            );
          })}
        </div> */}

        <div className="text-center">
          <Link to="/property-listings" className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary-700 transition-all">
            Xem Tất Cả Bất Động Sản
            <Icon name="ArrowRight" size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
