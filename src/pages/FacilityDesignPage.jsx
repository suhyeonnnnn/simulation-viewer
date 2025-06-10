import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 시설 유형 및 색상 매핑
const facilityTypes = [
  { value: "social", label: "Social Space", color: "bg-amber-400" },
  { value: "fitness", label: "Fitness", color: "bg-red-500" },
  { value: "study", label: "Study", color: "bg-blue-500" },
  { value: "meeting", label: "Meeting", color: "bg-green-500" },
  { value: "work", label: "Work", color: "bg-gray-600" },
  { value: "dining", label: "Dining", color: "bg-orange-500" },
  { value: "entertainment", label: "Entertainment", color: "bg-purple-500" },
  { value: "lab", label: "Laboratory", color: "bg-indigo-500" }
];

export default function FacilityDesignPage() {
  // 실제 구현에서는 useNavigate를 사용하지만, 여기서는 데모 목적으로 mock 함수 사용
  const navigate = useNavigate();
  
  const [facilities, setFacilities] = useState([{
    id: 1,
    name: "",
    openingHours: "08:00",
    closingHours: "22:00",
    capacity: 20,
    restrictions: "",
    type: "social",
    color: "bg-amber-400",
    textColor: "text-white",
    description: ""
  }]);
  const [generatedMap, setGeneratedMap] = useState([]);
  const [expandedFacility, setExpandedFacility] = useState(null);
  const [showGeneratedList, setShowGeneratedList] = useState(false);
  const [jsonPreview, setJsonPreview] = useState("");
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  const handleChange = (index, field, value) => {
    const updatedFacilities = [...facilities];
    updatedFacilities[index] = {
      ...updatedFacilities[index],
      [field]: value
    };
    
    // 시설 타입이 변경되면 색상도 함께 업데이트
    if (field === "type") {
      const selectedType = facilityTypes.find(t => t.value === value);
      if (selectedType) {
        updatedFacilities[index].color = selectedType.color;
      }
    }
    
    setFacilities(updatedFacilities);
  };

  const handleAdd = () => {
    // 새 ID는 현재 가장 큰 ID + 1
    const newId = facilities.length > 0 
      ? Math.max(...facilities.map(f => f.id)) + 1 
      : 1;
      
    setFacilities([...facilities, {
      id: newId,
      name: "",
      openingHours: "08:00",
      closingHours: "22:00",
      capacity: 20,
      restrictions: "",
      type: "social",
      color: "bg-amber-400",
      textColor: "text-white",
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
    
    // JSON 미리보기 생성
    const jsonData = {
      facilities: validFacilities.map(({ id, name, color, textColor, capacity, type, openingHours, closingHours, restrictions }) => ({
        id, name, color, textColor, capacity, type, openingHours, closingHours, restrictions
      }))
    };
    setJsonPreview(JSON.stringify(jsonData, null, 2));
  };

  const handleEditFacility = (index) => {
    const facilityToEdit = generatedMap[index];
    const editIndex = facilities.findIndex(f => f.id === facilityToEdit.id);
    
    if (editIndex >= 0) {
      setExpandedFacility(editIndex);
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
    setFacilities(facilities.filter(f => f.id !== facilityToRemove.id));
    generateMapLayout();
  };

  const handleProceedToPersona = () => {
    const validFacilities = facilities.filter(f => f.name.trim() !== "");
    
    if (validFacilities.length === 0) {
      alert("No facilities to save. Please create at least one facility.");
      return;
    }
    
    // JSON 데이터 생성
    const jsonData = {
      facilities: validFacilities.map(({ id, name, color, textColor, capacity, type, openingHours, closingHours, restrictions }) => ({
        id, name, color, textColor, capacity, type, openingHours, closingHours, restrictions
      }))
    };
    
    // localStorage에 저장
    try {
      localStorage.setItem('simulationFacilities', JSON.stringify(jsonData));
      console.log('Facilities saved to localStorage');
      
      // 성공 메시지 및 JSON 데이터 출력
      console.log('Saved JSON data:', jsonData);
      alert(`${validFacilities.length} facilities saved successfully!`);
      
      // 페이지 이동
      navigate('/personas');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      alert('Failed to save facilities. Please check console for details.');
    }
  };

  const toggleExpand = (index) => {
    if (expandedFacility === index) {
      setExpandedFacility(null);
    } else {
      setExpandedFacility(index);
    }
  };

  const toggleJsonPreview = () => {
    setShowJsonPreview(!showJsonPreview);
  };

  const copyJsonToClipboard = () => {
    try {
      navigator.clipboard.writeText(jsonPreview);
      alert("JSON copied to clipboard! You can save this as public/data/facilities.json");
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard. Please manually select and copy the text.');
    }
  };

  const getFacilityTypeName = (typeValue) => {
    const type = facilityTypes.find(t => t.value === typeValue);
    return type ? type.label : typeValue;
  };

  const getBackgroundColorPreview = (color) => {
    // Tailwind 클래스에서 실제 색상 코드로 변환 (간단한 매핑)
    const colorMap = {
      'bg-amber-400': '#fbbf24',
      'bg-red-500': '#ef4444',
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e',
      'bg-purple-500': '#a855f7',
      'bg-indigo-500': '#6366f1',
      'bg-gray-600': '#4b5563',
      'bg-teal-500': '#14b8a6',
      'bg-orange-500': '#f97316'
    };
    
    return colorMap[color] || '#cccccc';
  };
  
  // 다운로드 기능을 위한 함수
  const downloadFacilitiesJson = (jsonData) => {
    // JSON 데이터를 문자열로 변환
    const jsonString = JSON.stringify(jsonData, null, 2);
    
    // Blob 생성
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // 다운로드 링크 생성
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'facilities.json';
    
    // 링크 클릭하여 다운로드 시작
    document.body.appendChild(a);
    a.click();
    
    // 정리
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    alert("facilities.json 파일이 다운로드 되었습니다.\n이 파일을 public/data/ 폴더에 복사하세요.");
  };

  return (
    <div className="w-full bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center">
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
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getBackgroundColorPreview(facility.color) }}
                  ></div>
                  <input
                    type="text"
                    value={facility.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    className="flex-1 border border-gray-300 rounded p-2"
                    placeholder="Facility Name"
                  />
                  <select
                    value={facility.type}
                    onChange={(e) => handleChange(index, "type", e.target.value)}
                    className="border border-gray-300 rounded p-2"
                  >
                    {facilityTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
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
                        Opening Hours (AM/PM)
                      </label>
                      <div className="flex items-center">
                        <select 
                          value={facility.openingHours.split(':')[0]}
                          onChange={(e) => {
                            const hours = e.target.value;
                            const minutes = facility.openingHours.split(':')[1];
                            handleChange(index, "openingHours", `${hours}:${minutes}`);
                          }}
                          className="border border-gray-300 rounded-l p-2 w-1/2"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                            <option key={hour} value={hour < 10 ? `0${hour}` : `${hour}`}>
                              {hour}
                            </option>
                          ))}
                        </select>
                        <span className="mx-1">:</span>
                        <select 
                          value={facility.openingHours.split(':')[1]}
                          onChange={(e) => {
                            const hours = facility.openingHours.split(':')[0];
                            const minutes = e.target.value;
                            handleChange(index, "openingHours", `${hours}:${minutes}`);
                          }}
                          className="border border-gray-300 p-2 w-1/4"
                        >
                          <option value="00">00</option>
                          <option value="15">15</option>
                          <option value="30">30</option>
                          <option value="45">45</option>
                        </select>
                        <select 
                          className="border border-gray-300 rounded-r p-2 w-1/4"
                          onChange={(e) => {
                            let hours = parseInt(facility.openingHours.split(':')[0]);
                            const minutes = facility.openingHours.split(':')[1];
                            
                            // Convert to 24-hour format
                            if (e.target.value === "PM" && hours < 12) {
                              hours += 12;
                            } else if (e.target.value === "AM" && hours === 12) {
                              hours = 0;
                            }
                            
                            handleChange(index, "openingHours", `${hours.toString().padStart(2, '0')}:${minutes}`);
                          }}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Closing Hours (AM/PM)
                      </label>
                      <div className="flex items-center">
                        <select 
                          value={facility.closingHours.split(':')[0]}
                          onChange={(e) => {
                            const hours = e.target.value;
                            const minutes = facility.closingHours.split(':')[1];
                            handleChange(index, "closingHours", `${hours}:${minutes}`);
                          }}
                          className="border border-gray-300 rounded-l p-2 w-1/2"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                            <option key={hour} value={hour < 10 ? `0${hour}` : `${hour}`}>
                              {hour}
                            </option>
                          ))}
                        </select>
                        <span className="mx-1">:</span>
                        <select 
                          value={facility.closingHours.split(':')[1]}
                          onChange={(e) => {
                            const hours = facility.closingHours.split(':')[0];
                            const minutes = e.target.value;
                            handleChange(index, "closingHours", `${hours}:${minutes}`);
                          }}
                          className="border border-gray-300 p-2 w-1/4"
                        >
                          <option value="00">00</option>
                          <option value="15">15</option>
                          <option value="30">30</option>
                          <option value="45">45</option>
                        </select>
                        <select 
                          className="border border-gray-300 rounded-r p-2 w-1/4"
                          onChange={(e) => {
                            let hours = parseInt(facility.closingHours.split(':')[0]);
                            const minutes = facility.closingHours.split(':')[1];
                            
                            // Convert to 24-hour format
                            if (e.target.value === "PM" && hours < 12) {
                              hours += 12;
                            } else if (e.target.value === "AM" && hours === 12) {
                              hours = 0;
                            }
                            
                            handleChange(index, "closingHours", `${hours.toString().padStart(2, '0')}:${minutes}`);
                          }}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
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
                  className={`col-span-3 ${f.color} ${f.textColor} text-center p-2 text-sm rounded shadow`}
                  style={{ gridColumnStart: (f.x % 12) + 1, gridRowStart: f.y + 1 }}
                >
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs opacity-80">{f.openingHours}-{f.closingHours}</div>
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
                    <div className="flex items-center">
                      <div 
                        className={`w-4 h-4 rounded-full mr-2 ${facility.color}`}
                      ></div>
                      <h4 className="font-medium text-lg">{facility.name}</h4>
                      <span className="ml-2 text-sm text-gray-500">({getFacilityTypeName(facility.type)})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-2">
                      <div>Hours: {facility.openingHours} - {facility.closingHours}</div>
                      <div>Capacity: {facility.capacity} persons</div>
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

            <div className="mt-6 flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={toggleJsonPreview}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded font-medium"
                >
                  {showJsonPreview ? "Hide JSON" : "Show JSON"}
                </button>
                
                <button
                  onClick={() => {
                    // JSON 데이터 생성
                    const jsonData = {
                      facilities: generatedMap.map(({ id, name, color, textColor, capacity, type, openingHours, closingHours, restrictions }) => ({
                        id, name, color, textColor, capacity, type, openingHours, closingHours, restrictions
                      }))
                    };
                    
                    // 다운로드 함수 호출
                    downloadFacilitiesJson(jsonData);
                  }}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded font-medium"
                >
                  Download facilities.json
                </button>
              </div>
              
              <button
                onClick={handleProceedToPersona}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium"
              >
                Proceed to Persona Generation →
              </button>
            </div>
            
            {showJsonPreview && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">JSON Preview (public/data/facilities.json)</h4>
                  <button
                    onClick={copyJsonToClipboard}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {jsonPreview}
                </pre>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-sm">
          <div>PlaceSim v1.0 - LLM-Driven Simulation</div>
          <div>CIKM 2025 Demo</div>
        </div>
      </footer>
    </div>
  );
}