// import React, { useState, useEffect } from "react";
// import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";

// const containerStyle = {
//   width: "100%",
//   height: "100%"
// };

// const MapView = ({ properties, onPropertySelect, onBackToList }) => {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: "YOUR_API_KEY" // 🔑 thay bằng API key của bạn
//   });

//   const [mapCenter, setMapCenter] = useState({ lat: 21.0285, lng: 105.8542 }); // Hà Nội mặc định
//   const [zoom, setZoom] = useState(13);
//   const [selectedProperty, setSelectedProperty] = useState(null);

//   useEffect(() => {
//     if (properties?.length > 0) {
//       const lats = properties.map(p => p.coordinates.lat);
//       const lngs = properties.map(p => p.coordinates.lng);
//       setMapCenter({
//         lat: (Math.min(...lats) + Math.max(...lats)) / 2,
//         lng: (Math.min(...lngs) + Math.max(...lngs)) / 2
//       });
//     }
//   }, [properties]);

//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <div className="w-full h-[100vh] relative">
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={mapCenter}
//         zoom={zoom}
//       >
//         {properties?.map(property => (
//           <Marker
//             key={property.id}
//             position={property.coordinates}
//             onClick={() => setSelectedProperty(property)}
//           />
//         ))}

//         {selectedProperty && (
//           <InfoWindow
//             position={selectedProperty.coordinates}
//             onCloseClick={() => setSelectedProperty(null)}
//           >
//             <div className="p-2 max-w-xs">
//               <img
//                 src={selectedProperty.images?.[0]}
//                 alt={selectedProperty.title}
//                 className="w-full h-24 object-cover rounded"
//               />
//               <h3 className="font-semibold mt-1">{selectedProperty.title}</h3>
//               <p className="text-sm text-gray-600">{selectedProperty.address}</p>
//               <p className="text-blue-600 font-bold mt-1">
//                 {selectedProperty.price.toLocaleString()} VND
//               </p>
//               <button
//                 onClick={() => {
//                   onPropertySelect(selectedProperty);
//                   setSelectedProperty(null);
//                 }}
//                 className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
//               >
//                 Xem chi tiết
//               </button>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>

//       {/* Controls */}
//       <div className="absolute top-4 right-4 bg-white p-2 rounded shadow-md flex flex-col gap-2">
//         <button
//           onClick={() => setZoom(z => z + 1)}
//           className="px-2 py-1 bg-gray-200 rounded"
//         >
//           +
//         </button>
//         <button
//           onClick={() => setZoom(z => Math.max(z - 1, 1))}
//           className="px-2 py-1 bg-gray-200 rounded"
//         >
//           -
//         </button>
//       </div>

//       <button
//         onClick={onBackToList}
//         className="absolute top-4 left-4 bg-white px-3 py-1 rounded shadow-md"
//       >
//         Quay lại danh sách
//       </button>
//     </div>
//   );
// };

// export default MapView;
