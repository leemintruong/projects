// src/pages/property-details/components/PropertyTabs.jsx
import React, { useRef } from 'react';
import Icon from '../../../components/AppIcon';

const PropertyTabs = ({ property, activeTab, onTabChange }) => {
  const mapRef = useRef(null);

  const tabs = [
    { id: 'description', label: 'Mô tả', icon: 'FileText' },
    { id: 'amenities', label: 'Tiện nghi', icon: 'Star' },
    { id: 'location', label: 'Vị trí', icon: 'MapPin' },
    { id: 'schools', label: 'Trường học', icon: 'GraduationCap' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(price);
  };

  const renderDescription = () => (
    <div className="prose max-w-none">
      <div className="text-text-primary whitespace-pre-line leading-relaxed">
        {property?.description}
      </div>
      
      {property?.propertyHistory && property?.propertyHistory?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Lịch sử giá</h3>
          <div className="space-y-3">
            {property?.propertyHistory?.map((event, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                <div>
                  <p className="font-medium text-text-primary">{event?.event}</p>
                  <p className="text-sm text-text-secondary">{event?.date}</p>
                </div>
                <p className="font-semibold text-primary">
                  {formatPrice(event?.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAmenities = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {property?.amenities?.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-md">
            <Icon name="Check" size={16} className="text-success flex-shrink-0" />
            <span className="text-text-primary">{amenity}</span>
          </div>
        ))}
      </div>
      
      {(!property?.amenities || property?.amenities?.length === 0) && (
        <div className="text-center py-8">
          <Icon name="Star" size={48} className="text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">Không có tiện nghi nào được liệt kê</p>
        </div>
      )}
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6">
      {/* Điểm khu vực */}
      {property?.neighborhood && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-background rounded-md">
            <div className="text-2xl font-bold text-primary mb-1">
              {property?.neighborhood?.walkScore}
            </div>
            <div className="text-sm text-text-secondary">Điểm đi bộ</div>
            <div className="text-xs text-text-secondary mt-1">
              {property?.neighborhood?.walkScore >= 90 ? 'Thiên đường đi bộ' :
               property?.neighborhood?.walkScore >= 70 ? 'Rất tiện đi bộ' :
               property?.neighborhood?.walkScore >= 50 ? 'Khá tiện đi bộ' : 'Cần xe hơi'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-background rounded-md">
            <div className="text-2xl font-bold text-accent mb-1">
              {property?.neighborhood?.transitScore}
            </div>
            <div className="text-sm text-text-secondary">Điểm giao thông</div>
            <div className="text-xs text-text-secondary mt-1">
              {property?.neighborhood?.transitScore >= 90 ? 'Giao thông tuyệt vời' :
               property?.neighborhood?.transitScore >= 70 ? 'Giao thông tốt' :
               property?.neighborhood?.transitScore >= 50 ? 'Giao thông khá' : 'Một số tuyến'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-background rounded-md">
            <div className="text-2xl font-bold text-warning mb-1">
              {property?.neighborhood?.bikeScore}
            </div>
            <div className="text-sm text-text-secondary">Điểm xe đạp</div>
            <div className="text-xs text-text-secondary mt-1">
              {property?.neighborhood?.bikeScore >= 90 ? 'Thiên đường xe đạp' :
               property?.neighborhood?.bikeScore >= 70 ? 'Rất tiện xe đạp' :
               property?.neighborhood?.bikeScore >= 50 ? 'Có thể đi xe đạp' : 'Khá hạn chế'}
            </div>
          </div>
        </div>
      )}
      
      {/* Bản đồ */}
      <div className="bg-secondary-100 rounded-lg h-64 md:h-80 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Map" size={48} className="text-secondary mx-auto mb-2" />
          <p className="text-text-secondary">Bản đồ khu vực sẽ được hiển thị tại đây</p>
          <p className="text-sm text-text-secondary mt-1">
            Tọa độ: {property?.coordinates?.lat}, {property?.coordinates?.lng}
          </p>
        </div>
      </div>
      
      {/* Các địa điểm gần đây */}
      {property?.neighborhood?.nearbyPlaces && (
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Địa điểm gần đây</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {property?.neighborhood?.nearbyPlaces?.map((place, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-md">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={
                      place?.type === 'Park' ? 'Trees' :
                      place?.type === 'Shopping' ? 'ShoppingBag' :
                      place?.type === 'Transit' ? 'Train' :
                      place?.type === 'Grocery' ? 'ShoppingCart' : 'MapPin'
                    } 
                    size={16} 
                    className="text-primary" 
                  />
                  <div>
                    <p className="font-medium text-text-primary">{place?.name}</p>
                    <p className="text-sm text-text-secondary">{place?.type}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-primary">{place?.distance}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSchools = () => (
    <div>
      {property?.schools && property?.schools?.length > 0 ? (
        <div className="space-y-4">
          {property?.schools?.map((school, index) => (
            <div key={index} className="p-4 bg-background rounded-md">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-text-primary">{school?.name}</h3>
                  <p className="text-sm text-text-secondary">{school?.type}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold text-primary">{school?.rating}</span>
                    <span className="text-sm text-text-secondary">/10</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(10)]?.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < school?.rating ? 'bg-primary' : 'bg-secondary-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="MapPin" size={14} />
                <span>{school?.distance}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="GraduationCap" size={48} className="text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">Không có thông tin trường học</p>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return renderDescription();
      case 'amenities':
        return renderAmenities();
      case 'location':
        return renderLocation();
      case 'schools':
        return renderSchools();
      default:
        return renderDescription();
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto no-scrollbar">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => onTabChange(tab?.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary-50' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PropertyTabs;
