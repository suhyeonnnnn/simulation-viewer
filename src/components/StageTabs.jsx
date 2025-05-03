import React from "react";
import { useNavigate } from "react-router-dom";

const stages = [
  { name: "Home", path: "/" },
  { name: "Personas", path: "/personas" },
  { name: "Facilities", path: "/facilities" },
  { name: "Simulation", path: "/simulation" },
  { name: "Results", path: "/results" },
];

export default function StageTabs({ activeStage }) {
  const navigate = useNavigate();

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
