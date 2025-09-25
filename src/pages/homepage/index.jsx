
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/ui/Header";
import HeroSection from "./components/HeroSection";
import FeaturedProperties from "./components/FeaturedProperties";
import QuickStats from "./components/QuickStats";
import AgentSpotlight from "./components/AgentSpotlight";
import Footer from "./components/Footer";

const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (searchParams) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    // SPA navigation without page reload
    navigate(`/property-listings?${params.toString()}`);
  };

  // Skeleton for Featured Properties
  const renderPropertySkeleton = () =>
    Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="bg-surface rounded-lg overflow-hidden shadow-elevation-1 animate-pulse">
        <div className="h-48 bg-secondary-100"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-secondary-100 rounded w-full"></div>
          <div className="h-4 bg-secondary-100 rounded w-3/4"></div>
          <div className="h-4 bg-secondary-100 rounded w-1/2"></div>
        </div>
      </div>
    ));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 lg:pt-[4.5rem]">
          {/* Hero Skeleton */}
          <div className="relative h-[600px] bg-secondary-100 animate-pulse"></div>

          {/* Featured Properties Skeleton */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderPropertySkeleton()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 lg:pt-[4.5rem]">
        <HeroSection onSearch={handleSearch} />
        <FeaturedProperties />
        <QuickStats />
        <AgentSpotlight />
      </main>

      <Footer />
    </div>
  );
};

export default Homepage;
