import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mapBg from "../assets/Sample.png";
import StageTabs from "../components/StageTabs";

export default function FacilityDesignPage() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([{
    name: "",
    openingHours: "08:00",
    closingHours: "22:00",
    capacity: 20,
    restrictions: "",
    price: 0,
    description: ""
  }]);
  const [generatedMap, setGeneratedMap] = useState([]);
  const [expandedFacility, setExpandedFacility] = useState(null);
  const [showGeneratedList, setShowGeneratedList] = useState(false);

  const handleChange = (index, field, value) => {
    const updatedFacilities = [...facilities];
    updatedFacilities[index] = {
      ...updatedFacilities[index],
      [field]: value
    };
    setFacilities(updatedFacilities);
  };

  const handleAdd = () => {
    setFacilities([...facilities, {
      name: "",
      openingHours: "08:00",
      closingHours: "22:00",
      capacity: 20,
      restrictions: "",
      price: 0,
      description: ""
    }]);
  };

  const handleRemove = (index) => {
    const updatedFacilities = [...facilities];
    updatedFacilities.splice(index, 1);
    setFacilities(updatedFacilities);
  };

  const generateMapLayout = () => {
    const layout = facilities
      .filter(f => f.name.trim() !== "")
      .map((facility, idx) => ({
        ...facility,
        x: (idx % 4) * 3,
        y: Math.floor(idx / 4) * 3,
      }));
    setGeneratedMap(layout);
  };

  const handleGenerate = () => {
    const validFacilities = facilities.filter(f => f.name.trim() !== "");
    if (validFacilities.length === 0) {
      alert("Please add at least one facility with a name.");
      return;
    }
    
    generateMapLayout();
    setShowGeneratedList(true);
  };

  const handleEditFacility = (index) => {
    const facilityToEdit = generatedMap[index];
    const editIndex = facilities.findIndex(f => f.name === facilityToEdit.name);
    
    if (editIndex >= 0) {
      setExpandedFacility(editIndex);
      // 스크롤하여 해당 시설로 이동
      setTimeout(() => {
        const element = document.getElementById(`facility-${editIndex}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleRemoveGenerated = (index) => {
    const facilityToRemove = generatedMap[index];
    setFacilities(facilities.filter(f => f.name !== facilityToRemove.name));
    generateMapLayout();
  };

  const handleProceedToSimulation = () => {
    const validFacilities = facilities.filter(f => f.name.trim() !== "");
    
    if (validFacilities.length === 0) {
      alert("No facilities to save. Please create at least one facility.");
      return;
    }
    
    // 로컬 스토리지에 저장
    localStorage.setItem('simulationFacilities', JSON.stringify(validFacilities));
    
    // 시뮬레이션 페이지로 이동
    alert(`Facilities saved! Proceeding to simulation with ${validFacilities.length} facilities.`);
    navigate('/simulation');
  };

  const toggleExpand = (index) => {
    if (expandedFacility === index) {
      setExpandedFacility(null);
    } else {
      setExpandedFacility(index);
    }
  };

  return (
    <div className="w-full bg-gray-50">
      {/* Navigation - 내부 탭들 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16">
            <button className="px-3 py-1 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
              Facility Design
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Design Your Community Facilities
        </h2>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col gap-6 w-full">
            {facilities.map((facility, index) => (
              <div 
                key={index} 
                id={`facility-${index}`}
                className={`border rounded-lg p-4 ${expandedFacility === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <input
                    type="text"
                    value={facility.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    className="flex-1 border border-gray-300 rounded p-2"
                    placeholder="Facility Name"
                  />
                  <button
                    onClick={() => toggleExpand(index)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded"
                  >
                    {expandedFacility === index ? "▲" : "▼"}
                  </button>
                  <button
                    onClick={() => handleRemove(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                  >
                    ×
                  </button>
                </div>

                {expandedFacility === index && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opening Hours
                      </label>
                      <input
                        type="time"
                        value={facility.openingHours}
                        onChange={(e) => handleChange(index, "openingHours", e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Closing Hours
                      </label>
                      <input
                        type="time"
                        value={facility.closingHours}
                        onChange={(e) => handleChange(index, "closingHours", e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity (persons)
                      </label>
                      <input
                        type="number"
                        value={facility.capacity}
                        onChange={(e) => handleChange(index, "capacity", parseInt(e.target.value) || 0)}
                        className="border border-gray-300 rounded p-2 w-full"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (if applicable)
                      </label>
                      <input
                        type="number"
                        value={facility.price}
                        onChange={(e) => handleChange(index, "price", parseFloat(e.target.value) || 0)}
                        className="border border-gray-300 rounded p-2 w-full"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Usage Restrictions
                      </label>
                      <input
                        type="text"
                        value={facility.restrictions}
                        onChange={(e) => handleChange(index, "restrictions", e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="e.g., Age restrictions, membership required, etc."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={facility.description}
                        onChange={(e) => handleChange(index, "description", e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full h-24"
                        placeholder="Add a description of this facility"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={handleAdd}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded font-medium self-start"
            >
              + Add Facility
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGenerate}
              className="bg-[#002DAA] hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
            >
              Generate Facility Map
            </button>
          </div>
        </div>

        {generatedMap.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Generated Facility Map</h3>
            <div className="grid grid-cols-12 gap-1 border border-gray-200 p-4 bg-gray-50">
              {generatedMap.map((f, idx) => (
                <div
                  key={idx}
                  className="col-span-3 bg-green-100 border border-green-300 text-center p-2 text-sm"
                  style={{ gridColumnStart: (f.x % 12) + 1, gridRowStart: f.y + 1 }}
                >
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-gray-600">{f.openingHours}-{f.closingHours}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showGeneratedList && generatedMap.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Facility List</h3>
            <div className="space-y-4">
              {generatedMap.map((facility, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{facility.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-2">
                      <div>Hours: {facility.openingHours} - {facility.closingHours}</div>
                      <div>Capacity: {facility.capacity} persons</div>
                      {facility.price > 0 && <div>Price: ${facility.price.toFixed(2)}</div>}
                      {facility.restrictions && <div>Restrictions: {facility.restrictions}</div>}
                      {facility.description && (
                        <div className="md:col-span-2 text-gray-600 mt-1">
                          {facility.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditFacility(idx)}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveGenerated(idx)}
                      className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleProceedToSimulation}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium"
              >
                Proceed to Simulation →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 h-12 flex items-center justify-between px-8 text-sm text-[#666666]">
        <div>Facility Design Dashboard v1.0</div>
        <div>Developed by Suhyeon Lee</div>
      </footer>
    </div>
  );
}