import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { propertyService } from '../../../services/propertyService';
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

    const { data, error } = await propertyService?.getFeaturedProperties();

    if (error) {
      setError(error?.message);
    } else {
      setProperties(data || []);
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

    const isCurrentlySaved = savedProperties?.has(propertyId);

    if (isCurrentlySaved) {
      const { error } = await propertyService?.removeFromFavorites(propertyId, user?.id);
      if (!error) {
        setSavedProperties(prev => {
          const newSaved = new Set(prev);
          newSaved.delete(propertyId);
          return newSaved;
        });
      }
    } else {
      const { error } = await propertyService?.addToFavorites(propertyId, user?.id);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-heading">
              Bất Động Sản Nổi Bật
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Khám phá những bất động sản được lựa chọn kỹ càng từ các vị trí đắc địa nhất trên khắp Việt Nam
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)]?.map((_, i) => (
              <div key={i} className="bg-surface rounded-lg overflow-hidden shadow-elevation-1">
                <div className="h-48 bg-secondary-100 skeleton animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-secondary-100 rounded skeleton animate-pulse"></div>
                  <div className="h-4 bg-secondary-100 rounded w-3/4 skeleton animate-pulse"></div>
                  <div className="h-4 bg-secondary-100 rounded w-1/2 skeleton animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-error/10 border border-error/20 rounded-md">
              <Icon name="AlertCircle" size={16} className="mr-2 text-error" />
              <span className="text-sm text-error">{error}</span>
            </div>
          </div>
        </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {properties.map(property => {
            const primaryImage = property?.property_images?.find(img => img?.is_primary) || property?.property_images?.[0];
            const location = `${property?.districts?.name || ''}, ${property?.provinces?.name || ''}`;

            return (
              <div key={property.id} className="bg-surface rounded-lg overflow-hidden shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-300 ease-out micro-interaction group">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <Image
                    src={primaryImage?.image_url || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'}
                    alt={primaryImage?.alt_text || property?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary text-white px-2 py-1 rounded-md text-xs font-medium capitalize">
                      {property?.property_type?.replace('_', ' ')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSaveProperty(property.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200
                      ${savedProperties?.has(property.id) ? 'bg-error text-white' : 'bg-white/90 text-text-secondary hover:bg-white hover:text-error'}`}
                    aria-label={savedProperties?.has(property.id) ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Icon name="Heart" size={16} fill={savedProperties?.has(property.id) ? "currentColor" : "none"} />
                  </button>
                  {property?.days_on_market <= 7 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-success text-white px-2 py-1 rounded-md text-xs font-medium">
                        Tin Mới
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 lg:p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-text-secondary text-sm flex items-center">
                      <Icon name="MapPin" size={14} className="mr-1" />
                      {location}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center"><Icon name="Bed" size={14} className="mr-1" />{property.bedrooms} PN</span>
                      <span className="flex items-center"><Icon name="Bath" size={14} className="mr-1" />{property.bathrooms} PT</span>
                      <span className="flex items-center"><Icon name="Square" size={14} className="mr-1" />{property.area}m²</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Image src={property?.agent?.avatar_url || 'https://randomuser.me/api/portraits/women/32.jpg'} alt={property?.agent?.full_name || 'Agent'} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-sm text-text-secondary">{property?.agent?.full_name || 'Đại diện'}</span>
                    </div>
                    <Link to={`/property-details?id=${property.id}`} className="text-sm font-medium text-primary hover:text-primary-700 transition-colors">
                      Chi Tiết
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/property-listings" className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ease-out micro-interaction">
            Xem Tất Cả Bất Động Sản
            <Icon name="ArrowRight" size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
