import React, { useState } from "react";
import mapBg from "../assets/Sample.png";
import StageTabs from "../components/StageTabs";

export default function FacilityDesignPage() {
  const [facilityList, setFacilityList] = useState([""]);
  const [generatedMap, setGeneratedMap] = useState([]);

  const handleChange = (index, value) => {
    const updated = [...facilityList];
    updated[index] = value;
    setFacilityList(updated);
  };

  const handleAdd = () => {
    setFacilityList([...facilityList, ""]);
  };

  const handleRemove = (index) => {
    const updated = [...facilityList];
    updated.splice(index, 1);
    setFacilityList(updated);
  };

  const generateMapLayout = () => {
    const layout = facilityList
      .filter(f => f.trim() !== "")
      .map((name, idx) => ({
        name,
        x: (idx % 4) * 3,
        y: Math.floor(idx / 4) * 3,
      }));
    setGeneratedMap(layout);
  };

  const handleSubmit = () => {
    alert("Facility list submitted!\n" + facilityList.filter(f => f).join(", "));
    generateMapLayout();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-8"
      style={{
        backgroundColor: "#f7f6f3",
        fontFamily: "'VT323', monospace",
        //backgroundImage: `url(${mapBg})`,
        //backgroundRepeat: "repeat",
        imageRendering: "pixelated",
      }}
    >
      <StageTabs activeStage="Facilities" />

      <h2
        className="text-3xl font-bold mb-6 text-black"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        Design Your Community Facilities
      </h2>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {facilityList.map((facility, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={facility}
              onChange={(e) => handleChange(index, e.target.value)}
              className="flex-1 border border-gray-300 rounded p-2"
              placeholder={`Facility ${index + 1}`}
            />
            <button
              onClick={() => handleRemove(index)}
              className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={handleAdd}
          className="bg-yellow-300 hover:bg-yellow-400 text-black px-6 py-2 rounded font-bold border-2 border-black"
        >
          + Add Facility
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold border-2 border-black"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        Generate Facility Map
      </button>

      {generatedMap.length > 0 && (
        <div className="mt-10 w-full max-w-md bg-white border border-black p-4">
          <h3 className="text-lg font-bold mb-2">Generated Facility Map</h3>
          <div className="grid grid-cols-12 gap-1">
            {generatedMap.map((f, idx) => (
              <div
                key={idx}
                className="col-span-3 bg-green-300 text-center border border-black p-2 text-xs"
                style={{ gridColumnStart: (f.x % 12) + 1, gridRowStart: f.y + 1 }}
              >
                {f.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
