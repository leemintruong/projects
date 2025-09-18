// // src/pages/property-details/index.jsx
// import React, { useState, useEffect } from 'react';
// import { useSearchParams, Link } from 'react-router-dom';
// import Header from '../../components/ui/Header';
// import Icon from '../../components/AppIcon';
// import Image from '../../components/AppImage';

// // Import components
// import ImageGallery from './components/ImageGallery';
// import PropertyOverview from './components/PropertyOverview';
// import PropertyTabs from './components/PropertyTabs';
// import MortgageCalculator from './components/MortgageCalculator';
// import ContactForm from './components/ContactForm';
// import SimilarProperties from './components/SimilarProperties';
// import LoadingState from './components/LoadingState';

// const PropertyDetails = () => {
//   const [searchParams] = useSearchParams();
//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSaved, setIsSaved] = useState(false);
//   const [activeTab, setActiveTab] = useState('description');
//   const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
//   const [showContactForm, setShowContactForm] = useState(false);

//   const propertyId = searchParams?.get('id');

//   // Mock property data - in real app this would come from API
//   const mockProperty = {
//     id: 1,
//     title: "Modern Downtown Apartment",
//     price: 450000,
//     address: "123 Main Street, Downtown, NY 10001",
//     bedrooms: 2,
//     bathrooms: 2,
//     sqft: 1200,
//     propertyType: "apartment",
//     yearBuilt: 2019,
//     lotSize: null,
//     parkingSpaces: 1,
//     images: [
//       "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
//       "https://images.pixabay.com/photo/2017/03/28/12/13/chairs-2181968_1280.jpg?auto=compress&cs=tinysrgb&w=800",
//       "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
//       "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800",
//       "https://images.pixabay.com/photo/2016/12/30/07/59/kitchen-1940174_1280.jpg?auto=compress&cs=tinysrgb&w=800",
//       "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
//     ],
//     agent: {
//       name: "Sarah Johnson",
//       phone: "(555) 123-4567",
//       email: "sarah.johnson@estatehub.com",
//       avatar: "https://randomuser.me/api/portraits/women/32.jpg",
//       rating: 4.8,
//       reviewsCount: 127,
//       bio: "Sarah is a dedicated real estate professional with over 10 years of experience in the downtown market. She specializes in luxury apartments and condominiums."
//     },
//     coordinates: { lat: 40.7128, lng: -74.0060 },
//     daysOnMarket: 15,
//     mls: "MLS-2024-001234",
//     description: `Beautiful modern apartment in the heart of downtown with stunning city views and premium amenities. This spacious 2-bedroom, 2-bathroom unit features floor-to-ceiling windows, hardwood floors, and a gourmet kitchen with stainless steel appliances.

// The open floor plan creates a seamless flow between the living, dining, and kitchen areas, perfect for entertaining. The master bedroom includes a walk-in closet and ensuite bathroom with marble finishes.

// Building amenities include a fitness center, rooftop pool, 24-hour concierge service, and valet parking. Located within walking distance of restaurants, shopping, and public transportation with easy access to major highways.`,
//     amenities: [
//       "24-Hour Concierge",
//       "Fitness Center", 
//       "Rooftop Pool",
//       "Valet Parking",
//       "Pet Friendly",
//       "In-Unit Laundry",
//       "Balcony",
//       "Central Air",
//       "Hardwood Floors",
//       "Stainless Steel Appliances"
//     ],
//     schools: [
//       {
//         name: "Downtown Elementary School",
//         type: "Elementary",
//         rating: 8,
//         distance: "0.3 miles"
//       },
//       {
//         name: "Central Middle School", 
//         type: "Middle School",
//         rating: 7,
//         distance: "0.5 miles"
//       },
//       {
//         name: "Metropolitan High School",
//         type: "High School",
//         rating: 9,
//         distance: "0.7 miles"
//       }
//     ],
//     neighborhood: {
//       walkScore: 92,
//       transitScore: 85,
//       bikeScore: 78,
//       nearbyPlaces: [
//         { name: "Central Park", type: "Park", distance: "0.2 miles" },
//         { name: "Downtown Shopping Center", type: "Shopping", distance: "0.1 miles" },
//         { name: "Metro Station", type: "Transit", distance: "0.3 miles" },
//         { name: "Whole Foods Market", type: "Grocery", distance: "0.4 miles" }
//       ]
//     },
//     propertyHistory: [
//       { date: "2024-01-15", event: "Listed for Sale", price: 450000 },
//       { date: "2023-12-01", event: "Price Reduction", price: 465000 },
//       { date: "2023-10-20", event: "Listed for Sale", price: 475000 }
//     ],
//     virtualTour: "https://example.com/virtual-tour",
//     video: "https://example.com/property-video"
//   };

//   const similarProperties = [
//     {
//       id: 2,
//       title: "Luxury Suburban House",
//       price: 750000,
//       address: "456 Oak Avenue, Westfield, NJ 07090",
//       bedrooms: 4,
//       bathrooms: 3,
//       sqft: 2800,
//       images: ["https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"]
//     },
//     {
//       id: 3,
//       title: "Cozy Studio Loft",
//       price: 280000,
//       address: "789 Industrial Blvd, Brooklyn, NY 11201",
//       bedrooms: 1,
//       bathrooms: 1,
//       sqft: 650,
//       images: ["https://images.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg?auto=compress&cs=tinysrgb&w=800"]
//     },
//     {
//       id: 4,
//       title: "Waterfront Condo",
//       price: 920000,
//       address: "321 Harbor View, Jersey City, NJ 07302",
//       bedrooms: 3,
//       bathrooms: 2,
//       sqft: 1800,
//       images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"]
//     }
//   ];

//   useEffect(() => {
//     const fetchProperty = async () => {
//       setLoading(true);
//       // Simulate API call
//       setTimeout(() => {
//         setProperty(mockProperty);
//         setIsSaved(false);
//         setLoading(false);
//       }, 1000);
//     };

//     if (propertyId) {
//       fetchProperty();
//     }
//   }, [propertyId]);

//   const handleSave = () => {
//     setIsSaved(!isSaved);
//     // In real app, sync with backend
//   };

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: property?.title,
//         text: `Check out this property: ${property?.title}`,
//         url: window.location?.href
//       });
//     } else {
//       // Fallback to copy to clipboard
//       navigator.clipboard?.writeText(window.location?.href);
//     }
//   };

//   const getBreadcrumbs = () => {
//     const breadcrumbs = [
//       { label: 'Home', path: '/homepage' },
//       { label: 'Properties', path: '/property-listings' },
//       { label: property?.title || 'Property Details', path: null }
//     ];
//     return breadcrumbs;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Header />
//         <LoadingState />
//       </div>
//     );
//   }

//   if (!property) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Header />
//         <main className="pt-16 lg:pt-18">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//             <div className="text-center">
//               <Icon name="Home" size={64} className="text-secondary mx-auto mb-4" />
//               <h1 className="text-2xl font-bold text-text-primary mb-2">
//                 Property Not Found
//               </h1>
//               <p className="text-text-secondary mb-6">
//                 The property you're looking for doesn't exist or has been removed.
//               </p>
//               <Link
//                 to="/property-listings"
//                 className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-all duration-200"
//               >
//                 <Icon name="ArrowLeft" size={16} />
//                 <span>Back to Properties</span>
//               </Link>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
//       <main className="pt-16 lg:pt-18">
//         {/* Breadcrumb */}
//         <div className="bg-surface border-b border-border">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
//             <nav className="flex items-center space-x-2 text-sm">
//               {getBreadcrumbs()?.map((crumb, index) => (
//                 <React.Fragment key={index}>
//                   {index > 0 && (
//                     <Icon name="ChevronRight" size={14} className="text-text-secondary" />
//                   )}
//                   {crumb?.path ? (
//                     <Link
//                       to={crumb?.path}
//                       className="text-text-secondary hover:text-text-primary transition-colors duration-200"
//                     >
//                       {crumb?.label}
//                     </Link>
//                   ) : (
//                     <span className="text-text-primary font-medium truncate">{crumb?.label}</span>
//                   )}
//                 </React.Fragment>
//               ))}
//             </nav>
//           </div>
//         </div>

//         {/* Mobile Actions Bar */}
//         <div className="lg:hidden bg-surface border-b border-border sticky top-16 z-10">
//           <div className="px-4 py-3 flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={handleSave}
//                 className={`p-2 rounded-md transition-all duration-200 ${
//                   isSaved 
//                     ? 'bg-error text-white' :'bg-secondary-100 text-text-secondary hover:bg-error hover:text-white'
//                 }`}
//               >
//                 <Icon name="Heart" size={18} fill={isSaved ? "currentColor" : "none"} />
//               </button>
//               <button
//                 onClick={handleShare}
//                 className="p-2 bg-secondary-100 text-text-secondary rounded-md hover:bg-secondary-200 transition-all duration-200"
//               >
//                 <Icon name="Share" size={18} />
//               </button>
//             </div>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setShowContactForm(true)}
//                 className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-600 transition-all duration-200"
//               >
//                 Contact Agent
//               </button>
//               <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-all duration-200">
//                 Schedule Tour
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left Column - Main Content */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Image Gallery */}
//               <ImageGallery 
//                 images={property?.images}
//                 title={property?.title}
//                 virtualTour={property?.virtualTour}
//                 video={property?.video}
//               />

//               {/* Property Overview */}
//               <PropertyOverview 
//                 property={property}
//                 isSaved={isSaved}
//                 onSave={handleSave}
//                 onShare={handleShare}
//                 onContact={() => setShowContactForm(true)}
//               />

//               {/* Property Tabs */}
//               <PropertyTabs 
//                 property={property}
//                 activeTab={activeTab}
//                 onTabChange={setActiveTab}
//               />
//             </div>

//             {/* Right Column - Sidebar */}
//             <div className="space-y-6">
//               {/* Mortgage Calculator */}
//               <div className="hidden lg:block">
//                 <MortgageCalculator 
//                   propertyPrice={property?.price}
//                 />
//               </div>

//               {/* Mobile Mortgage Calculator Toggle */}
//               <div className="lg:hidden">
//                 <button
//                   onClick={() => setShowMortgageCalculator(!showMortgageCalculator)}
//                   className="w-full flex items-center justify-between p-4 bg-surface border border-border rounded-lg hover:shadow-elevation-2 transition-all duration-200"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <Icon name="Calculator" size={20} className="text-primary" />
//                     <span className="font-medium text-text-primary">Mortgage Calculator</span>
//                   </div>
//                   <Icon 
//                     name="ChevronDown" 
//                     size={16} 
//                     className={`text-text-secondary transition-transform duration-200 ${
//                       showMortgageCalculator ? 'rotate-180' : ''
//                     }`} 
//                   />
//                 </button>
//                 {showMortgageCalculator && (
//                   <div className="mt-4">
//                     <MortgageCalculator 
//                       propertyPrice={property?.price}
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Agent Contact Card */}
//               <div className="card p-6">
//                 <div className="flex items-center space-x-4 mb-4">
//                   <Image
//                     src={property?.agent?.avatar}
//                     alt={property?.agent?.name}
//                     className="w-16 h-16 rounded-full object-cover"
//                   />
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-text-primary">{property?.agent?.name}</h3>
//                     <div className="flex items-center space-x-1 mb-1">
//                       <div className="flex items-center">
//                         {[...Array(5)]?.map((_, i) => (
//                           <Icon
//                             key={i}
//                             name="Star"
//                             size={14}
//                             className={i < Math.floor(property?.agent?.rating) ? 'text-warning fill-current' : 'text-secondary-300'}
//                           />
//                         ))}
//                       </div>
//                       <span className="text-sm text-text-secondary">
//                         {property?.agent?.rating} ({property?.agent?.reviewsCount} reviews)
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <p className="text-sm text-text-secondary mb-4">
//                   {property?.agent?.bio}
//                 </p>
                
//                 <div className="space-y-3">
//                   <button
//                     onClick={() => setShowContactForm(true)}
//                     className="w-full flex items-center justify-center space-x-2 bg-primary text-white py-3 rounded-md hover:bg-primary-700 transition-all duration-200"
//                   >
//                     <Icon name="MessageCircle" size={16} />
//                     <span>Send Message</span>
//                   </button>
                  
//                   <div className="grid grid-cols-2 gap-2">
//                     <button className="flex items-center justify-center space-x-2 bg-accent-100 text-accent-600 py-2 rounded-md hover:bg-accent hover:text-white transition-all duration-200">
//                       <Icon name="Phone" size={16} />
//                       <span className="text-sm">Call</span>
//                     </button>
//                     <button className="flex items-center justify-center space-x-2 bg-secondary-100 text-text-secondary py-2 rounded-md hover:bg-secondary-200 transition-all duration-200">
//                       <Icon name="Calendar" size={16} />
//                       <span className="text-sm">Schedule</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Similar Properties */}
//           <div className="mt-12">
//             <SimilarProperties properties={similarProperties} />
//           </div>
//         </div>
//       </main>
//       {/* Contact Form Modal */}
//       {showContactForm && (
//         <ContactForm
//           property={property}
//           agent={property?.agent}
//           onClose={() => setShowContactForm(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default PropertyDetails;
// src/pages/property-details/PropertyDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

// Components
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

// Loading state component
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <span className="text-text-secondary">Loading property...</span>
  </div>
);

// Main Component
const PropertyDetails = () => {
  const [searchParams] = useSearchParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const propertyId = searchParams?.get('id');

  // Mock property
  const mockProperty = {
    id: 1,
    title: "Modern Downtown Apartment",
    price: 450000,
    address: "123 Main Street, Downtown, NY 10001",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    propertyType: "apartment",
    yearBuilt: 2019,
    parkingSpaces: 1,
    images: [
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pixabay.com/photo/2017/03/28/12/13/chairs-2181968_1280.jpg?auto=compress&cs=tinysrgb&w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
    ],
    agent: {
      name: "Sarah Johnson",
      phone: "(555) 123-4567",
      email: "sarah.johnson@estatehub.com",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 4.8,
      reviewsCount: 127,
      bio: "Sarah is a dedicated real estate professional with over 10 years of experience."
    },
    description: `Beautiful modern apartment in the heart of downtown with stunning city views and premium amenities.`,
    amenities: ["24-Hour Concierge", "Fitness Center", "Rooftop Pool", "Valet Parking"],
    virtualTour: "https://example.com/virtual-tour",
    video: "https://example.com/property-video"
  };

  const similarProperties = [
    {
      id: 2,
      title: "Luxury Suburban House",
      price: 750000,
      address: "456 Oak Avenue, Westfield, NJ 07090",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      images: ["https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"]
    },
    {
      id: 3,
      title: "Cozy Studio Loft",
      price: 280000,
      address: "789 Industrial Blvd, Brooklyn, NY 11201",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      images: ["https://images.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg?auto=compress&cs=tinysrgb&w=800"]
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProperty(mockProperty);
      setIsSaved(false);
      setLoading(false);
    }, 1000);
  }, [propertyId]);

  const handleSave = () => setIsSaved(!isSaved);
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: property?.title, text: `Check out this property: ${property?.title}`, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

  const getBreadcrumbs = () => [
    { label: 'Home', path: '/homepage' },
    { label: 'Properties', path: '/property-listings' },
    { label: property?.title || 'Property Details', path: null }
  ];

  // ---------------- Similar Properties Component ----------------
  const SimilarProperties = ({ properties = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);

    const scrollToIndex = (index) => {
      if (containerRef?.current) {
        const cardWidth = containerRef?.current?.children?.[0]?.offsetWidth || 0;
        const gap = 16;
        containerRef.current.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
        setCurrentIndex(index);
      }
    };

    const handlePrevious = () => scrollToIndex(currentIndex > 0 ? currentIndex - 1 : Math.max(0, properties.length - 3));
    const handleNext = () => scrollToIndex(currentIndex < Math.max(0, properties.length - 3) ? currentIndex + 1 : 0);

    if (!properties?.length)
      return <div className="text-center py-12">No Similar Properties</div>;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">Similar Properties</h2>
          {properties.length > 3 && (
            <div className="hidden md:flex items-center space-x-2">
              <button onClick={handlePrevious}><Icon name="ChevronLeft" size={20} /></button>
              <button onClick={handleNext}><Icon name="ChevronRight" size={20} /></button>
            </div>
          )}
        </div>

        <div className="relative">
          <div ref={containerRef} className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
            {properties.map((prop) => (
              <Link key={prop.id} to={`/property-details?id=${prop.id}`} className="flex-shrink-0 w-80 md:w-96 group">
                <div className="card hover:shadow transition-all duration-200 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary line-clamp-1">{prop.title}</h3>
                    <p className="text-xl font-bold text-primary">{formatPrice(prop.price)}</p>
                    <p className="text-text-secondary text-sm mb-3 line-clamp-1">{prop.address}</p>
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      <div className="flex items-center space-x-1"><Icon name="Bed" size={14} /><span>{prop.bedrooms}</span></div>
                      <div className="flex items-center space-x-1"><Icon name="Bath" size={14} /><span>{prop.bathrooms}</span></div>
                      <div className="flex items-center space-x-1"><Icon name="Square" size={14} /><span>{formatNumber(prop.sqft)} sq ft</span></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ---------------- Image Gallery ----------------
  const ImageGallery = ({ images = [], title }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((img, i) => (
          <Image key={i} src={img} alt={`${title} ${i + 1}`} className="w-full h-48 object-cover rounded-md" />
        ))}
      </div>
    </div>
  );

  // ---------------- Property Tabs ----------------
  const PropertyTabs = ({ property, activeTab, onTabChange }) => (
    <div className="mt-6">
      <div className="flex space-x-4 border-b border-border">
        {['description', 'amenities'].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`py-2 px-4 ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="mt-4 text-text-secondary">
        {activeTab === 'description' ? property.description : property.amenities.join(', ')}
      </div>
    </div>
  );

  // ---------------- Mortgage Calculator ----------------
  const MortgageCalculator = ({ propertyPrice }) => (
    <div className="card p-4">
      <h3 className="font-semibold text-text-primary mb-2">Mortgage Calculator</h3>
      <p className="text-text-secondary text-sm">Property Price: {formatPrice(propertyPrice)}</p>
      {/* Simplified calculator mock */}
      <input type="number" placeholder="Down Payment" className="w-full border border-border p-2 rounded mt-2 mb-2" />
      <input type="number" placeholder="Interest Rate (%)" className="w-full border border-border p-2 rounded mb-2" />
      <button className="w-full bg-primary text-white py-2 rounded">Calculate</button>
    </div>
  );

  // ---------------- Contact Form ----------------
  const ContactForm = ({ property, agent, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <h3 className="text-xl font-bold text-text-primary">Contact Agent</h3>
        <p>Agent: {agent.name}</p>
        <input type="text" placeholder="Your Name" className="w-full border border-border p-2 rounded" />
        <input type="email" placeholder="Your Email" className="w-full border border-border p-2 rounded" />
        <textarea placeholder="Message" className="w-full border border-border p-2 rounded" />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button className="px-4 py-2 bg-primary text-white rounded">Send</button>
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingState />;

  if (!property) return <div>Property Not Found</div>;

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm mb-4">
        {getBreadcrumbs().map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Icon name="ChevronRight" size={14} />}
            {crumb.path ? <Link to={crumb.path}>{crumb.label}</Link> : <span>{crumb.label}</span>}
          </React.Fragment>
        ))}
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={property.images} title={property.title} />
          <PropertyTabs property={property} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="space-y-6">
          <MortgageCalculator propertyPrice={property.price} />
          {/* Agent Card */}
          <div className="card p-4">
            <div className="flex items-center space-x-4 mb-2">
              <Image src={property.agent.avatar} alt={property.agent.name} className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="font-semibold">{property.agent.name}</h3>
              </div>
            </div>
            <p className="text-sm text-text-secondary">{property.agent.bio}</p>
            <button onClick={() => setShowContactForm(true)} className="w-full mt-2 bg-primary text-white py-2 rounded">Contact Agent</button>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      <div className="mt-12">
        <SimilarProperties properties={similarProperties} />
      </div>

      {/* Contact Modal */}
      {showContactForm && <ContactForm property={property} agent={property.agent} onClose={() => setShowContactForm(false)} />}
    </div>
  );
};

export default PropertyDetails;
