import React, { useState, useEffect } from 'react';

// Translation helper for Korean reasons - 컴포넌트 외부에 위치한 일반 함수
const translateReason = (reason) => {
  const translations = {
    "시설이 휴무": "Facility is closed",
    "너무 이른 시간": "Too early",
    "방문할 친구가 없음": "No friends to visit",
    "너무 늦은 시간": "Too late"
  };
  
  return translations[reason] || reason;
};

// Facility status check helper - 컴포넌트 외부에 위치한 일반 함수
const isFacilityOpen = (facility, day, time) => {
  // Check if the facility is closed on this day
  if (facility.closed && facility.closed.includes(day)) {
    return false;
  }
  
  // Determine if we're checking for a weekday or weekend
  const isWeekend = day === "Saturday" || day === "Sunday";
  const isMonday = day === "Monday";
  
  // Get opening and closing times
  let openTime, closeTime;
  
  if (isMonday && facility.opn?.mon) {
    openTime = facility.opn.mon;
    closeTime = facility.cls?.mon || (isWeekend ? facility.cls?.wkn : facility.cls?.wkd);
  } else if (isWeekend) {
    openTime = facility.opn?.wkn;
    closeTime = facility.cls?.wkn;
  } else {
    openTime = facility.opn?.wkd;
    closeTime = facility.cls?.wkd;
  }
  
  // Handle special case where closing time is after midnight
  if (closeTime === "25:00") {
    closeTime = "01:00"; // Next day 1 AM
  }
  
  // Check if current time is within opening hours
  return time >= openTime && time <= closeTime;
};

// 시설 데이터와 요금 맵을 props로 받도록 수정
const SimulationViewer = ({ facilitiesData, feeMap, initialSimulationData = [] }) => {
  // 모든 state들을 컴포넌트 내부 최상위에 정의
  const [simulationData, setSimulationData] = useState(initialSimulationData);
  const [currentDay, setCurrentDay] = useState("Monday");
  const [currentTime, setCurrentTime] = useState("06:00");
  const [selectedPersona, setSelectedPersona] = useState("persona_1_base");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [playSimulation, setPlaySimulation] = useState(false);
  const [currentSimIndex, setCurrentSimIndex] = useState(0);
  const [simSpeed, setSimSpeed] = useState(500); // Default 500ms (faster)
  const [currentSimulation, setCurrentSimulation] = useState(null);
  
  // Load simulation data - 실제 앱에서는 props로 받은 데이터를 사용할 수도 있음
  useEffect(() => {
    const loadData = async () => {
      if (initialSimulationData.length > 0) {
        setSimulationData(initialSimulationData);
        return;
      }
      
      try {
        // In a real app, you would fetch this from an API or file
        // For this example, we'll attempt to load from a file if available
        const response = await fetch('/data/simulationData.json');
        const data = await response.json();
        setSimulationData(data);
      } catch (error) {
        console.error("Error loading simulation data:", error);
        // Fallback to empty array if file not found
        setSimulationData([]);
      }
    };
    
    loadData();
  }, [initialSimulationData]);
  
  // Update current simulation whenever day, time, or persona changes
  useEffect(() => {
    if (simulationData && simulationData.length > 0) {
      const simulation = simulationData.find(
        sim => sim.scenario?.day_of_week === currentDay && 
               sim.scenario?.time === currentTime &&
               sim.persona_id === selectedPersona
      );
      setCurrentSimulation(simulation || null);
    }
  }, [simulationData, currentDay, currentTime, selectedPersona]);
  
  // Handle simulation playback with adjustable speed
  useEffect(() => {
    let interval;
    
    if (playSimulation && simulationData && simulationData.length > 0) {
      interval = setInterval(() => {
        setCurrentSimIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % simulationData.length;
          const newSim = simulationData[newIndex];
          
          if (newSim && newSim.scenario) {
            setCurrentDay(newSim.scenario.day_of_week);
            setCurrentTime(newSim.scenario.time);
          }
          
          return newIndex;
        });
      }, simSpeed);
    }
    
    return () => clearInterval(interval);
  }, [playSimulation, simulationData, simSpeed]);
  
  // Determine character activities based on time - 컴포넌트 내부의 일반 함수
  const getCharacterActivity = (time) => {
    switch(time) {
      case "06:00":
        return { action: "sleeping", location: "bedroom", conversation: "None at the moment" };
      case "09:00":
        return { action: "having breakfast", location: "dining room", conversation: "Planning the day" };
      case "12:00":
        return { action: "eating lunch", location: "카페테리아", conversation: "Discussing work" };
      case "15:00":
        return { action: "exercising", location: "피트니스", conversation: "Chatting about health" };
      case "18:00":
        return { action: "relaxing", location: "common area", conversation: "Talking about dinner plans" };
      case "21:00":
        return { action: "preparing for bed", location: "residential area", conversation: "Brief goodnight chat" };
      default:
        return { action: "undefined", location: "unknown", conversation: "None at the moment" };
    }
  };
  
  // Find character location based on time and day - 컴포넌트 내부의 일반 함수
  const getCharacterLocation = (persona, day, time) => {
    // Find current simulation result
    const simData = simulationData?.find(
      sim => sim.scenario?.day_of_week === day && 
             sim.scenario?.time === time &&
             sim.persona_id === persona
    );
    
    if (!simData) return "Unknown";
    
    // If there's a no_visit_reason, character is not at a facility
    if (simData.result?.no_visit_reason) {
      // Based on no_visit_reason and time, determine likely location
      if (simData.result.no_visit_reason === "너무 이른 시간" || 
          simData.result.no_visit_reason === "너무 늦은 시간") {
        return "Home/Dorm";
      } else if (simData.result.no_visit_reason === "시설이 휴무") {
        return "Common Area";
      } else {
        return "Personal Space";
      }
    } else if (simData.result?.facilities && simData.result.facilities.length > 0) {
      // Character is at one of the facilities
      return simData.result.facilities[0];
    } else {
      return "Common Area";
    }
  };
  
  // Get current character activity data
  const currentActivity = getCharacterActivity(currentTime);
  const currentLocation = getCharacterLocation(selectedPersona, currentDay, currentTime);
  
  // Calculate available days and times from data
  const availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const availableTimes = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
  
  // Handle time selection
  const handleTimeChange = (time) => {
    setCurrentTime(time);
    setPlaySimulation(false);
  };
  
  // Handle day selection
  const handleDayChange = (day) => {
    setCurrentDay(day);
    setPlaySimulation(false);
  };
  
  // Toggle simulation playback
  const togglePlay = () => {
    setPlaySimulation(!playSimulation);
  };
  
  // List of characters with their emoji representations
  const characters = [
    { id: "persona_1_base", emoji: "👨", name: "John" },
    { id: "persona_2", emoji: "👩", name: "Mary" },
    { id: "persona_3", emoji: "👦", name: "Tommy" },
    { id: "persona_4", emoji: "👧", name: "Lucy" },
    { id: "persona_5", emoji: "👴", name: "George" },
    { id: "persona_6", emoji: "👵", name: "Martha" },
    { id: "persona_7", emoji: "👨‍🦰", name: "Robert" },
    { id: "persona_8", emoji: "👩‍🦰", name: "Alice" },
  ];
  
  return (
    <div className="flex flex-col h-full bg-gray-100 p-4 text-sm">
      {/* Header with title */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">Generative Agents: Interactive Simulacra of Human Behavior</h1>
        <p className="text-sm text-gray-500">This is a pre-computed replay of a simulation for demonstration purposes only.</p>
      </div>
      
      {/* Simulation controls */}
      <div className="flex items-center justify-between mb-4 bg-white p-2 rounded shadow">
        <div>
          <span className="font-bold">Current Time: </span>
          <span>{currentDay}, {currentTime} AM</span>
        </div>
        
        <div className="flex space-x-2 items-center">
          <div className="mr-4">
            <label htmlFor="speed" className="text-sm mr-2">Speed:</label>
            <select 
              id="speed" 
              value={simSpeed}
              onChange={(e) => setSimSpeed(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value="1000">Slow (1s)</option>
              <option value="500">Normal (0.5s)</option>
              <option value="200">Fast (0.2s)</option>
              <option value="100">Very Fast (0.1s)</option>
            </select>
          </div>
          
          <button 
            onClick={togglePlay}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {playSimulation ? "⏸ Pause" : "▶ Play"}
          </button>
        </div>
      </div>
      
      {/* Main simulation area */}
      <div className="flex">
        {/* Left side: Environment */}
        <div className="flex-grow mr-4">
          <div className="bg-green-200 p-4 rounded shadow h-72 flex items-center justify-center relative">
            {/* Building outline - simplified from your image */}
            <div className="absolute w-3/4 h-4/5 bg-yellow-100 border-2 border-gray-700">
              {/* Main building with facilities */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-gray-700 bg-orange-100 flex flex-col">
                <div className="flex-1 border-b border-gray-700 flex">
                  <div className="w-1/2 border-r border-gray-700 flex items-center justify-center">
                    <div className="text-xs">사우나</div>
                  </div>
                  <div className="w-1/2 flex items-center justify-center">
                    <div className="text-xs">피트니스</div>
                  </div>
                </div>
                <div className="flex-1 flex">
                  <div className="w-1/2 border-r border-gray-700 flex items-center justify-center">
                    <div className="text-xs">골프클럽</div>
                  </div>
                  <div className="w-1/2 flex items-center justify-center">
                    <div className="text-xs">카페테리아</div>
                  </div>
                </div>
              </div>
              
              {/* Additional facilities */}
              <div className="absolute top-3/4 right-1/4 w-1/4 h-1/6 border-2 border-gray-700 bg-green-100 flex items-center justify-center">
                <div className="text-xs">키즈카페</div>
              </div>
              
              <div className="absolute bottom-1/4 left-1/6 w-1/5 h-1/6 border-2 border-gray-700 bg-blue-100 flex items-center justify-center">
                <div className="text-xs">독서실</div>
              </div>
              
              <div className="absolute top-1/6 right-1/6 w-1/5 h-1/6 border-2 border-gray-700 bg-purple-100 flex items-center justify-center">
                <div className="text-xs">스카이라운지</div>
              </div>
            </div>
            
            {/* Trees */}
            <div className="absolute top-1/4 left-10 text-2xl">🌳</div>
            <div className="absolute top-1/3 left-20 text-2xl">🌳</div>
            <div className="absolute bottom-10 right-10 text-2xl">🌲</div>
          </div>
          
          {/* Day selection */}
          <div className="mt-4 bg-white p-2 rounded shadow">
            <div className="flex justify-between">
              {availableDays.map(day => (
                <button 
                  key={day}
                  className={`px-2 py-1 rounded ${currentDay === day ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleDayChange(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          
          {/* Time selection */}
          <div className="mt-4 bg-white p-2 rounded shadow">
            <div className="flex justify-between">
              {availableTimes.map(time => (
                <button 
                  key={time}
                  className={`px-2 py-1 rounded ${currentTime === time ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleTimeChange(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right side: Characters */}
        <div className="w-1/3 bg-white rounded shadow p-4">
          <h2 className="font-bold mb-4">Characters</h2>
          
          {/* Character grid */}
          <div className="grid grid-cols-4 gap-2">
            {characters.map(char => (
              <div 
                key={char.id} 
                className={`p-2 text-center rounded cursor-pointer ${selectedPersona === char.id ? 'bg-yellow-200' : 'bg-gray-100'}`}
                onClick={() => setSelectedPersona(char.id)}
              >
                <div className="text-2xl">{char.emoji}</div>
                <div className="text-xs">{char.name}</div>
                {/* Status indicator - change based on time */}
                {currentTime === "06:00" && (
                  <div className="text-xs text-blue-500">💤</div>
                )}
                {currentTime === "12:00" && (
                  <div className="text-xs">🍽️</div>
                )}
                {currentTime === "15:00" && (
                  <div className="text-xs">🏋️</div>
                )}
                {currentTime === "18:00" && (
                  <div className="text-xs">🎮</div>
                )}
                {currentTime === "21:00" && (
                  <div className="text-xs">📱</div>
                )}
              </div>
            ))}
          </div>
          
          {/* Selected character info */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center">
              <div className="text-3xl mr-4">{characters.find(c => c.id === selectedPersona)?.emoji || "👤"}</div>
              <div>
                <h3 className="font-bold">{characters.find(c => c.id === selectedPersona)?.name || "Unknown"}</h3>
                <div className="text-gray-600 text-sm">Status: {
                  simulationData.length > 0 && currentSimulation ? 
                  (currentSimulation.result?.no_visit_reason ? 
                  `Not visiting (${translateReason(currentSimulation.result.no_visit_reason)})` : 
                  "Visiting facilities") : 
                  "No data available"
                }</div>
              </div>
            </div>
            
            {/* Current action */}
            <div className="mt-4">
              <div className="font-bold text-sm">Current Action:</div>
              <div className="text-sm">{currentActivity.action}</div>
            </div>
            
            {/* Location */}
            <div className="mt-2">
              <div className="font-bold text-sm">Location:</div>
              <div className="text-sm">{currentLocation}</div>
            </div>
            
            {/* Conversation */}
            <div className="mt-2">
              <div className="font-bold text-sm">Current Conversation:</div>
              <div className="text-sm italic">{currentActivity.conversation}</div>
            </div>
            
            {/* Persona simulation stats */}
            <div className="mt-4 pt-2 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="bg-blue-100 p-1 rounded">
                  <div className="font-bold">Energy</div>
                  <div className="mt-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{ width: `${currentTime === "06:00" ? 100 : 
                                      currentTime === "09:00" ? 90 : 
                                      currentTime === "12:00" ? 70 : 
                                      currentTime === "15:00" ? 50 : 
                                      currentTime === "18:00" ? 30 : 20}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-green-100 p-1 rounded">
                  <div className="font-bold">Mood</div>
                  <div className="mt-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full" 
                      style={{ width: `${currentTime === "06:00" ? 60 : 
                                      currentTime === "09:00" ? 70 : 
                                      currentTime === "12:00" ? 85 : 
                                      currentTime === "15:00" ? 75 : 
                                      currentTime === "18:00" ? 90 : 65}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-red-100 p-1 rounded">
                  <div className="font-bold">Hunger</div>
                  <div className="mt-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-500 h-full" 
                      style={{ width: `${currentTime === "06:00" ? 20 : 
                                      currentTime === "09:00" ? 10 : 
                                      currentTime === "12:00" ? 5 : 
                                      currentTime === "15:00" ? 30 : 
                                      currentTime === "18:00" ? 10 : 25}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simulation details and facilities */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Simulation details */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Simulation Details</h2>
          
          <div className="text-sm">
            <div><span className="font-bold">Simulation ID:</span> {simulationData.length > 0 && currentSimulation ? currentSimulation.simulation_id : "N/A"}</div>
            <div><span className="font-bold">Persona:</span> {selectedPersona}</div>
            <div><span className="font-bold">Day/Time:</span> {currentDay} at {currentTime}</div>
            <div><span className="font-bold">Result:</span> {
              simulationData.length > 0 && currentSimulation ? 
              (currentSimulation.result?.no_visit_reason ? 
              `No visit: ${translateReason(currentSimulation.result.no_visit_reason)}` : 
              "Visiting facilities") : 
              "No data available"
            }</div>
          </div>
        </div>
        
        {/* Facilities */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Facilities</h2>
          
          <div className="text-sm">
            <div className="mb-2">
              <span className="font-bold">Available Facilities:</span>
            </div>
            
            <div className="max-h-32 overflow-y-auto mb-2">
              {Object.keys(facilitiesData).map(facilityKey => {
                const facility = facilitiesData[facilityKey];
                const isOpen = isFacilityOpen(facility, currentDay, currentTime);
                
                return (
                  <div 
                    key={facilityKey} 
                    className={`mb-1 p-1 rounded cursor-pointer ${
                      selectedFacility === facilityKey ? 'bg-blue-200 border border-blue-500' : 
                      isOpen ? 'bg-green-100' : 'bg-red-100'
                    }`}
                    onClick={() => setSelectedFacility(facilityKey)}
                  >
                    <span className="font-semibold">{facility.name}</span>
                    <span className="ml-2 text-xs">
                      {isOpen ? `Open (${currentDay === "Saturday" || currentDay === "Sunday" ? 
                                        facility.opn?.wkn || "-" : 
                                        facility.opn?.wkd || "-"} - ${
                                        currentDay === "Saturday" || currentDay === "Sunday" ? 
                                        facility.cls?.wkn || "-" : 
                                        facility.cls?.wkd || "-"})` : 
                                "Closed"}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Selected facility details */}
            {selectedFacility && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <h3 className="font-bold text-sm mb-1">{facilitiesData[selectedFacility].name} Details:</h3>
                <div className="bg-gray-50 p-2 rounded text-xs">
                  {facilitiesData[selectedFacility].gender && (
                    <div><span className="font-semibold">Gender:</span> {facilitiesData[selectedFacility].gender}</div>
                  )}
                  <div><span className="font-semibold">Location:</span> {facilitiesData[selectedFacility].loc}</div>
                  
                  {facilitiesData[selectedFacility].closed && (
                    <div><span className="font-semibold">Closed Days:</span> {facilitiesData[selectedFacility].closed.join(', ')}</div>
                  )}
                  
                  {facilitiesData[selectedFacility].fees && (
                    <div className="mt-1">
                      <span className="font-semibold">Fees:</span>
                      <ul className="list-disc pl-4 mt-1">
                        {Object.entries(facilitiesData[selectedFacility].fees).map(([feeKey, feeValue]) => (
                          <li key={feeKey}>
                            {feeMap[feeKey] || feeKey}: {Array.isArray(feeValue) ? feeValue.join('/') : feeValue}원
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {facilitiesData[selectedFacility].fee_note && (
                    <div className="mt-1"><span className="font-semibold">Note:</span> {facilitiesData[selectedFacility].fee_note}</div>
                  )}
                  
                  {facilitiesData[selectedFacility].restr && (
                    <div className="mt-1">
                      <span className="font-semibold">Restrictions:</span>
                      <ul className="list-disc pl-4 mt-1">
                        {facilitiesData[selectedFacility].restr.map((restriction, idx) => (
                          <li key={idx}>{restriction}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationViewer;