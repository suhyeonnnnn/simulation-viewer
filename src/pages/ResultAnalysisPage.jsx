import React, { useState, useEffect } from 'react';
import { Clock, Users, Calendar, Filter, Settings, Download, HelpCircle, Maximize2 } from 'lucide-react';

export default function PersonaSimulationView() {
  // Mock data for simulation
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedFacilities, setSelectedFacilities] = useState(["all"]);
  const [selectedPersonas, setSelectedPersonas] = useState(["all"]);
  const [viewMode, setViewMode] = useState("timeline");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(8); // Starting at 8 AM

  // Facility types with colors
  const facilities = [
    { id: "cafe", name: "Cafe", color: "bg-amber-500" },
    { id: "gym", name: "Gym", color: "bg-red-500" },
    { id: "library", name: "Library", color: "bg-blue-500" },
    { id: "conference", name: "Conference Room", color: "bg-green-500" },
    { id: "lounge", name: "Lounge", color: "bg-purple-500" }
  ];

  // Persona types
  const personas = [
    { id: "student", name: "Student", icon: "🧑‍🎓", color: "bg-blue-400" },
    { id: "professional", name: "Professional", icon: "👔", color: "bg-gray-600" },
    { id: "researcher", name: "Researcher", icon: "🔬", color: "bg-green-600" },
    { id: "visitor", name: "Visitor", icon: "🧳", color: "bg-yellow-500" },
    { id: "staff", name: "Staff", icon: "🛠️", color: "bg-red-400" }
  ];

  // Mock usage data - [persona, facility, startTime, endTime, day]
  const usageData = [
    // Students
    { personaId: "student", facilityId: "library", startTime: 9, endTime: 12, day: 0 },
    { personaId: "student", facilityId: "cafe", startTime: 12, endTime: 13, day: 0 },
    { personaId: "student", facilityId: "library", startTime: 13, endTime: 17, day: 0 },
    { personaId: "student", facilityId: "gym", startTime: 17, endTime: 19, day: 0 },
    { personaId: "student", facilityId: "lounge", startTime: 19, endTime: 21, day: 0 },
    
    // Professionals
    { personaId: "professional", facilityId: "cafe", startTime: 8, endTime: 9, day: 0 },
    { personaId: "professional", facilityId: "conference", startTime: 9, endTime: 12, day: 0 },
    { personaId: "professional", facilityId: "cafe", startTime: 12, endTime: 13, day: 0 },
    { personaId: "professional", facilityId: "conference", startTime: 13, endTime: 17, day: 0 },
    { personaId: "professional", facilityId: "gym", startTime: 17.5, endTime: 18.5, day: 0 },
    
    // Researchers
    { personaId: "researcher", facilityId: "library", startTime: 8, endTime: 11, day: 0 },
    { personaId: "researcher", facilityId: "conference", startTime: 11, endTime: 12, day: 0 },
    { personaId: "researcher", facilityId: "cafe", startTime: 12, endTime: 13, day: 0 },
    { personaId: "researcher", facilityId: "library", startTime: 13, endTime: 18, day: 0 },
    { personaId: "researcher", facilityId: "lounge", startTime: 18, endTime: 19, day: 0 },
    
    // Visitors
    { personaId: "visitor", facilityId: "cafe", startTime: 9, endTime: 10, day: 0 },
    { personaId: "visitor", facilityId: "conference", startTime: 10, endTime: 12, day: 0 },
    { personaId: "visitor", facilityId: "cafe", startTime: 12, endTime: 13, day: 0 },
    { personaId: "visitor", facilityId: "lounge", startTime: 13, endTime: 14, day: 0 },
    { personaId: "visitor", facilityId: "library", startTime: 14, endTime: 16, day: 0 },
    
    // Staff
    { personaId: "staff", facilityId: "cafe", startTime: 7, endTime: 11, day: 0 },
    { personaId: "staff", facilityId: "cafe", startTime: 11, endTime: 15, day: 0 },
    { personaId: "staff", facilityId: "conference", startTime: 15, endTime: 16, day: 0 },
    { personaId: "staff", facilityId: "lounge", startTime: 16, endTime: 17, day: 0 },
    { personaId: "staff", facilityId: "gym", startTime: 17, endTime: 18, day: 0 },
  ];

  // Additional days of data
  const expandedUsageData = [...usageData];
  for (let day = 1; day < 7; day++) {
    usageData.forEach(usage => {
      // Add some slight randomness to times for different days
      const timeVariation = (Math.random() * 0.5) - 0.25;
      const startTime = Math.max(7, Math.min(21, usage.startTime + timeVariation));
      const duration = usage.endTime - usage.startTime;
      const endTime = Math.min(22, startTime + duration);
      
      expandedUsageData.push({
        personaId: usage.personaId,
        facilityId: usage.facilityId,
        startTime: startTime,
        endTime: endTime,
        day: day
      });
    });
  }

  // Calculate facility usage for current time
  const getCurrentUsage = () => {
    const activeUsage = expandedUsageData.filter(usage => 
      (selectedFacilities.includes("all") || selectedFacilities.includes(usage.facilityId)) &&
      (selectedPersonas.includes("all") || selectedPersonas.includes(usage.personaId)) &&
      usage.startTime <= currentTime && 
      usage.endTime > currentTime
    );
    
    // Group by facility
    return facilities.map(facility => {
      const usersInFacility = activeUsage.filter(usage => usage.facilityId === facility.id);
      const personaCount = {};
      
      personas.forEach(persona => {
        personaCount[persona.id] = usersInFacility.filter(u => u.personaId === persona.id).length;
      });
      
      return {
        facility: facility,
        totalUsers: usersInFacility.length,
        personaBreakdown: personaCount
      };
    });
  };

  // Timeline generation
  const generateTimelineData = () => {
    const timeline = [];
    const filteredData = expandedUsageData.filter(usage => 
      (selectedFacilities.includes("all") || selectedFacilities.includes(usage.facilityId)) &&
      (selectedPersonas.includes("all") || selectedPersonas.includes(usage.personaId))
    );
    
    // Group by persona
    personas.forEach(persona => {
      if (selectedPersonas.includes("all") || selectedPersonas.includes(persona.id)) {
        const personaUsage = filteredData.filter(usage => usage.personaId === persona.id);
        
        timeline.push({
          persona: persona,
          usage: personaUsage
        });
      }
    });
    
    return timeline;
  };

  // Handle simulation
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + (0.1 * simulationSpeed);
          if (newTime >= 22) {
            setIsSimulating(false);
            return 8; // Reset to start time
          }
          return newTime;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  const formatTime = (time) => {
    const hour = Math.floor(time);
    const minute = Math.round((time - hour) * 60);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const timelineTimeslots = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-indigo-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
            <Users size={18} />
          </div>
          <span className="font-bold text-lg">Neural Canvas: Persona Simulator</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock size={18} />
          <span>{formatTime(currentTime)}</span>
        </div>
      </header>
      
      {/* Control Panel */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Time Range</label>
              <select 
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="24h">24 Hours</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Facilities</label>
              <select 
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                value={selectedFacilities}
                onChange={(e) => setSelectedFacilities([e.target.value])}
              >
                <option value="all">All Facilities</option>
                {facilities.map(facility => (
                  <option key={facility.id} value={facility.id}>{facility.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Personas</label>
              <select 
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                value={selectedPersonas}
                onChange={(e) => setSelectedPersonas([e.target.value])}
              >
                <option value="all">All Personas</option>
                {personas.map(persona => (
                  <option key={persona.id} value={persona.id}>{persona.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">View Mode</label>
              <select 
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
              >
                <option value="timeline">Timeline</option>
                <option value="heatmap">Heatmap</option>
                <option value="stats">Statistics</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Simulation Speed</label>
              <select 
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                disabled={!isSimulating}
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="5">5x</option>
              </select>
            </div>
            
            <button 
              className={`flex items-center px-4 py-2 rounded-md text-white ${isSimulating ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
              onClick={() => setIsSimulating(!isSimulating)}
            >
              {isSimulating ? 'Pause' : 'Simulate'}
            </button>
            
            <button 
              className="flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => setCurrentTime(8)}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Time Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Current Time: {formatTime(currentTime)}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">8:00 AM</span>
                <input 
                  type="range" 
                  min="8" 
                  max="22" 
                  step="0.1" 
                  value={currentTime}
                  onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                  className="w-64"
                />
                <span className="text-sm">10:00 PM</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full relative">
              <div 
                className="absolute h-full bg-indigo-600 rounded-full"
                style={{ width: `${((currentTime - 8) / 14) * 100}%` }}
              ></div>
            </div>
          </div>

          {viewMode === "timeline" && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Persona Daily Timelines</h3>
              
              <div className="relative">
                {/* Time indicators */}
                <div className="flex border-b mb-2">
                  <div className="w-32"></div>
                  <div className="flex-1 flex">
                    {timelineTimeslots.map((time, i) => (
                      <div key={i} className="flex-1 text-xs text-center text-gray-500">
                        {time % 2 === 0 ? `${time}:00` : ''}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Timeline rows */}
                {generateTimelineData().map((timeline, i) => (
                  <div key={i} className="flex py-2 items-center border-b border-gray-100">
                    {/* Persona info */}
                    <div className="w-32 flex items-center space-x-2">
                      <span className="text-2xl">{timeline.persona.icon}</span>
                      <span className="text-sm font-medium">{timeline.persona.name}</span>
                    </div>
                    
                    {/* Timeline */}
                    <div className="flex-1 relative h-8">
                      {/* Current time indicator */}
                      <div 
                        className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                        style={{ left: `${((currentTime - 8) / 14) * 100}%` }}
                      ></div>
                      
                      {/* Usage blocks */}
                      {timeline.usage.filter(u => u.day === 0).map((usage, j) => {
                        const facility = facilities.find(f => f.id === usage.facilityId);
                        const startPercent = ((usage.startTime - 8) / 14) * 100;
                        const widthPercent = ((usage.endTime - usage.startTime) / 14) * 100;
                        
                        return (
                          <div 
                            key={j} 
                            className={`absolute top-0 h-8 rounded-md ${facility.color} text-white text-xs flex items-center justify-center overflow-hidden`}
                            style={{ 
                              left: `${startPercent}%`, 
                              width: `${widthPercent}%` 
                            }}
                          >
                            {widthPercent > 10 && facility.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Facility Current Usage - show in all view modes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Facility Usage</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {getCurrentUsage().map((usage, i) => (
                <div key={i} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className={`${usage.facility.color} py-2 px-4 text-white font-medium`}>
                    {usage.facility.name}
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-bold mb-2">{usage.totalUsers}</div>
                    <div className="text-sm text-gray-500">Current Users</div>
                    
                    {/* Persona breakdown */}
                    <div className="mt-4 space-y-2">
                      {personas.map(persona => (
                        <div key={persona.id} className="flex items-center text-sm">
                          <span className="mr-2">{persona.icon}</span>
                          <span className="flex-1">{persona.name}</span>
                          <span className="font-medium">{usage.personaBreakdown[persona.id]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4 text-sm text-gray-600 flex justify-between">
        <div>Neural Canvas: Persona Facility Simulator v1.0</div>
        <div className="flex space-x-4">
          <button className="flex items-center opacity-70 hover:opacity-100">
            <Download size={16} className="mr-1" /> Export Data
          </button>
          <button className="flex items-center opacity-70 hover:opacity-100">
            <HelpCircle size={16} className="mr-1" /> Help
          </button>
          <button className="flex items-center opacity-70 hover:opacity-100">
            <Settings size={16} className="mr-1" /> Settings
          </button>
        </div>
      </footer>
    </div>
  );
}