import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const PageWithTabs = ({ children, activeStage }) => {
  const navigate = useNavigate();
  
  const stages = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Facilities", path: "/facilities", icon: "🏢" },
    { name: "Personas", path: "/personas", icon: "👥" },
    { name: "Simulation", path: "/simulation", icon: "⚡" },
    { name: "What If", path: "/what-if", icon: "🔮" },
    { name: "Results", path: "/results", icon: "📊" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* 통합된 헤더 */}
      <div className="bg-[#002DAA] w-full">
        {/* Main header section with tabs */}
        <div className="h-24 flex items-center justify-between px-8">
          {/* Logo and title */}
          <div className="flex items-center">
            <span className="text-white text-2xl font-bold mr-3">🤖</span>
            <h1 className="text-white text-2xl font-bold font-inter-bold">
              PlaceSim
            </h1>
          </div>
          
          {/* Navigation tabs in header */}
          <div className="flex items-center gap-2">
            {stages.map(({ name, path, icon }) => (
              <button
                key={name}
                onClick={() => navigate(path)}
                className={`flex items-center gap-1 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeStage === name 
                    ? "bg-white text-[#002DAA] font-medium" 
                    : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-sm">{name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Project info banner */}
        <div className="bg-white bg-opacity-10 py-2 px-8 text-white text-sm">
          This project was created as part of the KAIST-CMU Visiting Program
        </div>
      </div>
      
      {/* 자식 컴포넌트 */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};