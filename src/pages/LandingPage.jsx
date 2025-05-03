import React from "react";
import { useNavigate } from "react-router-dom";
import characterImg from "../assets/스크린샷 2025-05-02 오전 12.38.07.png";
import characterImg2 from "../assets/스크린샷 2025-05-02 오전 12.40.12.png";
import characterImg3 from "../assets/스크린샷 2025-05-02 오전 12.42.24.png";
import mapBg from "../assets/스크린샷 2025-05-02 오전 12.42.24.png"; // 배경용 도트맵 이미지

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-100 bg-repeat"
      style={{
        backgroundImage: `url(${mapBg})`,
        imageRendering: "pixelated",
      }}
    >
      <h1
        className="text-5xl font-bold mb-6 text-black drop-shadow"
        style={{
          fontFamily: "'Press Start 2P', cursive",
        }}
      >
        LLM BEHAVIOR SIMULATOR
      </h1>

      <p
        className="text-4xl text-gray-800 mb-8"
        style={{
          fontFamily: "'VT323', monospace",
        }}
      >
        Create AI Personas. Design Spaces. Simulate Movements.
      </p>

      <button
        onClick={() => navigate("/personas")}
        className="bg-yellow-300 hover:bg-yellow-400 text-black px-10 py-6 text-xl font-bold rounded-xl shadow-lg border-2 border-black transition-all"
        style={{
          fontFamily: "'Press Start 2P', cursive",
        }}
      >
        Start Simulation
      </button>

      {/* 캐릭터 아이콘 */}
      {/*
      <div className="mt-12 flex space-x-8">
         <img src={characterImg} alt="Character A" className="w-60 h-60" />
         <img src={characterImg2} alt="Character B" className="w-60 h-60" />
         <img src={characterImg3} alt="Character C" className="w-60 h-60" />
      </div>
      */}
    </div>
  );
}
