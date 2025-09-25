// // src/pages/agent-dashboard/index.jsx
// import React, { useState, useEffect } from 'react';
// import Header from '../../components/ui/Header';
// import PerformanceMetrics from './components/PerformanceMetrics';
// import RecentActivity from './components/RecentActivity';
// import QuickActions from './components/QuickActions';
// import ActiveListings from './components/ActiveListings';
// import LeadManagement from './components/LeadManagement';
// import UpcomingShowings from './components/UpcomingShowings';
// import AnalyticsSection from './components/AnalyticsSection';
// import QuickListingForm from './components/QuickListingForm';

// const AgentDashboard = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [showQuickListingForm, setShowQuickListingForm] = useState(false);
//   const [selectedListings, setSelectedListings] = useState([]);
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1200);

//     const notificationTimer = setInterval(() => {
//       const mockNotifications = [
//         'Yêu cầu khách hàng mới tại 123 Đường Oak',
//         'Giảm giá được phê duyệt cho 456 Đại lộ Pine',
//         'Lịch xem nhà được lên lịch vào ngày mai lúc 2 PM'
//       ];
//       const randomNotification = mockNotifications?.[Math.floor(Math.random() * mockNotifications?.length)];
//       setNotifications(prev => [{
//         id: Date.now(),
//         message: randomNotification,
//         timestamp: new Date()
//       }, ...prev?.slice(0, 4)]);
//     }, 30000);

//     return () => {
//       clearTimeout(timer);
//       clearInterval(notificationTimer);
//     };
//   }, []);

//   const handleBulkAction = (action, listingIds) => {
//     console.log(`Thao tác hàng loạt ${action} cho danh sách:`, listingIds);
//   };

//   const handleQuickListing = () => {
//     setShowQuickListingForm(true);
//   };

//   const handleListingSubmit = (listingData) => {
//     console.log('Dữ liệu danh sách mới:', listingData);
//     setShowQuickListingForm(false);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Header />
//         <div className="pt-16 lg:pt-18">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             {/* Dashboard Skeleton */}
//             <div className="mb-8">
//               <div className="h-8 bg-secondary-100 rounded w-1/3 mb-4 skeleton"></div>
//               <div className="h-4 bg-secondary-100 rounded w-1/2 skeleton"></div>
//             </div>
            
//             {/* Metrics Skeleton */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//               {[...Array(4)]?.map((_, i) => (
//                 <div key={i} className="bg-surface p-6 rounded-lg shadow-elevation-1">
//                   <div className="h-4 bg-secondary-100 rounded w-1/2 mb-2 skeleton"></div>
//                   <div className="h-8 bg-secondary-100 rounded w-3/4 skeleton"></div>
//                 </div>
//               ))}
//             </div>
            
//             {/* Content Skeleton */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-2">
//                 <div className="h-64 bg-secondary-100 rounded-lg skeleton mb-8"></div>
//                 <div className="h-96 bg-secondary-100 rounded-lg skeleton"></div>
//               </div>
//               <div className="space-y-8">
//                 <div className="h-64 bg-secondary-100 rounded-lg skeleton"></div>
//                 <div className="h-64 bg-secondary-100 rounded-lg skeleton"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
      
//       <main className="pt-16 lg:pt-18">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Dashboard Header */}
//           <div className="mb-8">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold text-text-primary font-heading mb-2">
//                   Bảng điều khiển đại lý
//                 </h1>
//                 <p className="text-text-secondary">
//                   Quản lý danh sách, theo dõi khách hàng tiềm năng và giám sát hiệu suất
//                 </p>
//               </div>
//               <div className="mt-4 md:mt-0">
//                 <button
//                   onClick={handleQuickListing}
//                   className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-all duration-200 ease-out micro-interaction shadow-elevation-1"
//                 >
//                   Tạo danh sách mới
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Performance Metrics */}
//           <PerformanceMetrics />

//           {/* Dashboard Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//             {/* Main Content Area */}
//             <div className="lg:col-span-2 space-y-8">
//               <QuickActions onQuickListing={handleQuickListing} />
//               <ActiveListings 
//                 selectedListings={selectedListings}
//                 onSelectionChange={setSelectedListings}
//                 onBulkAction={handleBulkAction}
//               />
//               <AnalyticsSection />
//             </div>

//             {/* Sidebar */}
//             <div className="space-y-8">
//               <RecentActivity notifications={notifications} />
//               <LeadManagement />
//               <UpcomingShowings />
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Quick Listing Form Modal */}
//       {showQuickListingForm && (
//         <QuickListingForm 
//           onClose={() => setShowQuickListingForm(false)}
//           onSubmit={handleListingSubmit}
//         />
//       )}
//     </div>
//   );
// };

// export default AgentDashboard;
// import React from "react";
// import { useAuth } from "../contexts/AuthContext";

// const AgentDashboard = () => {
//   const { user, signOut } = useAuth();

//   if (!user) return <p>Vui lòng đăng nhập để xem dashboard</p>;

//   return (
//     <div className="p-4">
//       <h1>Chào mừng {user.full_name}</h1>
//       <p>Email: {user.email}</p>
//       <p>Role: {user.role}</p>
//       <button onClick={signOut} className="mt-2 px-4 py-2 bg-red-500 text-white rounded">
//         Đăng xuất
//       </button>
//     </div>
//   );
// };

// export default AgentDashboard;
import React from "react";
import Login from "../components/auth/Login";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Login onClose={() => console.log("Đã đóng login")} />
    </div>
  );
};

export default AgentDashboard;
