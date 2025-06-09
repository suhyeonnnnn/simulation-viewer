import React from "react";
import { useNavigate } from "react-router-dom";

export default function StageTabs({ activeStage }) {
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
    <div className="flex space-x-4 mb-6">
      {stages.map(({ name, path }) => (
        <button
          key={name}
          onClick={() => navigate(path)}
          className={`px-4 py-2 font-bold rounded border-2 ${
            activeStage === name ? "bg-black text-white" : "bg-white text-black"
          }`}
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          {name}
        </button>
      ))}
    </div>
  );
}