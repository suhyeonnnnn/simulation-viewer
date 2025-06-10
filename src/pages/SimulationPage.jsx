import React, { useState, useEffect } from 'react';

// Select components
const Select = ({ children, value, onValueChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  const handleSelect = (newValue) => {
    setCurrentValue(newValue);
    if (onValueChange) onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (!child) return null;
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            isOpen: isOpen
          });
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            isOpen: isOpen,
            onSelect: handleSelect,
            value: currentValue
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, className = '', onClick }) => (
  <button 
    className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ${className}`} 
    onClick={onClick}
  >
    {children}
  </button>
);

const SelectValue = ({ placeholder, value }) => {
  return <span>{value || placeholder}</span>;
};

const SelectContent = ({ children, onSelect, isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md mt-1">
      {React.Children.map(children, child => 
        React.cloneElement(child, { onSelect })
      )}
    </div>
  );
};

const SelectItem = ({ children, value, onSelect }) => (
  <div 
    className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-gray-100"
    onClick={(e) => {
      e.stopPropagation();
      onSelect(value);
    }}
  >
    {children}
  </div>
);

// Custom UI Components
const Avatar = ({ children, className = '' }) => (
  <div className={`relative inline-flex ${className}`}>
    {children}
  </div>
);

const AvatarFallback = ({ children, className = '' }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, className = '', variant = 'default' }) => (
  <div className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = '', onClick, disabled }) => (
  <button 
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

const Separator = ({ className = '' }) => (
  <div className={`shrink-0 bg-border h-[1px] w-full ${className}`}></div>
);

// Tooltip component
const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`fixed z-[9999] px-4 py-3 text-sm text-white bg-gray-900 rounded-lg shadow-xl whitespace-normal max-w-sm pointer-events-none`}
             style={{
               top: position === 'top' ? 'auto' : '100%',
               bottom: position === 'top' ? '100%' : 'auto',
               left: '50%',
               transform: 'translateX(-50%)',
               marginBottom: position === 'top' ? '8px' : '0',
               marginTop: position === 'top' ? '0' : '8px'
             }}>
          {content}
          <div className={`absolute w-3 h-3 bg-gray-900 rotate-45 ${
            position === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2' :
            'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2'
          }`}></div>
        </div>
      )}
    </div>
  );
};

export default function PlaceSim() {
  // State for simulation
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState('1x');
  const [currentDay, setCurrentDay] = useState('Mon');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState('localStorage'); // 'localStorage' or 'sample'
  
  // Simulation data state
  const [simulationData, setSimulationData] = useState({
    facilities: [],
    personas: []
  });

  // Default facilities if none in localStorage
  const defaultFacilities = [
    { id: 1, name: "Cafe", color: "bg-amber-400", textColor: "text-white", capacity: 20, type: "social" },
    { id: 2, name: "Library", color: "bg-blue-500", textColor: "text-white", capacity: 20, type: "study" },
    { id: 3, name: "Conference Room", color: "bg-green-500", textColor: "text-white", capacity: 20, type: "meeting" },
    { id: 4, name: "Gym", color: "bg-red-500", textColor: "text-white", capacity: 20, type: "fitness" },
    { id: 5, name: "Lounge", color: "bg-purple-500", textColor: "text-white", capacity: 20, type: "social" },
    { id: 6, name: "Office", color: "bg-gray-600", textColor: "text-white", capacity: 20, type: "work" },
    { id: 7, name: "Lab", color: "bg-indigo-500", textColor: "text-white", capacity: 20, type: "research" },
    { id: 8, name: "Study Room", color: "bg-teal-500", textColor: "text-white", capacity: 20, type: "study" },
    { id: 9, name: "Dining Hall", color: "bg-orange-500", textColor: "text-white", capacity: 20, type: "social" }
  ];

  // Load data from localStorage
  const loadLocalStorageData = () => {
    try {
      // Load facilities from localStorage
      const storedFacilities = localStorage.getItem('simulationFacilities');
      let facilities = [];
      
      if (storedFacilities) {
        const facilitiesData = JSON.parse(storedFacilities);
        if (facilitiesData.facilities && Array.isArray(facilitiesData.facilities)) {
          facilities = facilitiesData.facilities.map((facility, index) => ({
            id: facility.id || index + 1,
            name: facility.name,
            color: facility.color || defaultFacilities.find(f => f.name === facility.name)?.color || "bg-gray-500",
            textColor: "text-white",
            capacity: facility.capacity || 20,
            type: facility.type || "general"
          }));
        }
      }
      
      // Use default facilities if none found
      if (facilities.length === 0) {
        facilities = defaultFacilities;
      }

      // Load personas from localStorage
      const storedPersonas = localStorage.getItem('simulationPersonas');
      let personas = [];
      
      if (storedPersonas) {
        const personasData = JSON.parse(storedPersonas);
        if (personasData.personas && Array.isArray(personasData.personas)) {
          personas = personasData.personas;
        }
      }

      setSimulationData({
        facilities: facilities,
        personas: personas
      });

      // Auto-select first person
      if (personas.length > 0) {
        setSelectedPerson(personas[0]);
      }

      console.log('Loaded from localStorage:', {
        facilities: facilities.length,
        personas: personas.length
      });

    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      // Fallback to default facilities
      setSimulationData({
        facilities: defaultFacilities,
        personas: []
      });
    }
  };

  // Load sample data from public folder (fallback)
  const loadSampleData = async () => {
    setIsLoading(true);
    try {
      // Load facilities data
      const facilitiesResponse = await fetch('/data/facilities.json');
      const facilitiesData = await facilitiesResponse.json();
      
      // Load sample personas data
      const personasResponse = await fetch('/data/sample-personas.json');
      const personasData = await personasResponse.json();
      
      setSimulationData({
        facilities: facilitiesData.facilities,
        personas: personasData.personas
      });
      
      // Auto-select first person
      if (personasData.personas.length > 0) {
        setSelectedPerson(personasData.personas[0]);
      }
      
    } catch (error) {
      console.error('Failed to load sample data:', error);
      // Fallback to default facilities
      setSimulationData({
        facilities: defaultFacilities,
        personas: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (dataSource === 'localStorage') {
      loadLocalStorageData();
    } else {
      loadSampleData();
    }
  }, [dataSource]);

  // Get people data from simulationData
  const people = simulationData.personas;

  // Convert time to display format
  const getTimeDisplay = (timeIndex) => {
    const hour = Math.floor(timeIndex / 4) + 8;
    const minute = (timeIndex % 4) * 15;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  // Get current location for a person based on their individual schedule
  const getCurrentLocation = (personId, time) => {
    const hourFraction = time / 4;
    const hour = Math.floor(hourFraction + 8);
    
    const person = people.find(p => p.id === personId);
    if (!person || !person.daily_schedule) return "No visit";

    for (const slot of person.daily_schedule) {
      const [start, end] = slot.time_slot.split('-');
      const startHour = parseInt(start.split(':')[0]);
      const endHour = parseInt(end.split(':')[0]);
      
      if (hour >= startHour && hour < endHour) {
        return slot.location || "No visit";
      }
    }
    return "No visit";
  };

  // Get current activity reasoning
  const getCurrentReasoning = (personId, time) => {
    const hourFraction = time / 4;
    const hour = Math.floor(hourFraction + 8);
    
    const person = people.find(p => p.id === personId);
    if (!person || !person.daily_schedule) return "No reasoning available";

    for (const slot of person.daily_schedule) {
      const [start, end] = slot.time_slot.split('-');
      const startHour = parseInt(start.split(':')[0]);
      const endHour = parseInt(end.split(':')[0]);
      
      if (hour >= startHour && hour < endHour) {
        return slot.llm_reasoning || "No reasoning available";
      }
    }
    return "No reasoning available";
  };

  // Calculate grouped location data
  const getLocationPeople = () => {
    const locations = simulationData.facilities.map(facility => ({
      location: facility.name,
      color: facility.color,
      textColor: facility.textColor,
      people: people.filter(person => getCurrentLocation(person.id, currentTime) === facility.name)
    }));

    // Add "No visit" location
    locations.unshift({
      location: "No visit",
      color: "bg-black",
      textColor: "text-white",
      people: people.filter(person => getCurrentLocation(person.id, currentTime) === "No visit")
    });

    return locations;
  };

  // Get facilities with current usage data
  const getFacilities = () => {
    return simulationData.facilities.map(facility => {
      const currentUsers = people.filter(person => getCurrentLocation(person.id, currentTime) === facility.name);
      
      // Calculate age and gender distribution
      const demographics = {
        // Age groups
        teens: currentUsers.filter(p => {
          const age = p.details?.age || 0;
          return age >= 10 && age < 20;
        }).length,
        twenties: currentUsers.filter(p => {
          const age = p.details?.age || 0;
          return age >= 20 && age < 30;
        }).length,
        thirties: currentUsers.filter(p => {
          const age = p.details?.age || 0;
          return age >= 30 && age < 40;
        }).length,
        forties_plus: currentUsers.filter(p => {
          const age = p.details?.age || 0;
          return age >= 40;
        }).length,
        // Gender
        male: currentUsers.filter(p => {
          const gender = p.details?.gender || p.gender || '';
          return gender.toLowerCase() === 'male';
        }).length,
        female: currentUsers.filter(p => {
          const gender = p.details?.gender || p.gender || '';
          return gender.toLowerCase() === 'female';
        }).length,
      };
      
      return {
        ...facility,
        users: currentUsers.length,
        demographics
      };
    });
  };

  // Simulation logic
  useEffect(() => {
    let interval;
    
    if (isPlaying) {
      const speedMultiplier = parseFloat(speed.replace('x', ''));
      interval = setInterval(() => {
        setCurrentTime(prev => {
          // 시간이 한 사이클을 완료하면 요일 변경
          if (prev === 95) {
            setCurrentDay(prevDay => {
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              const currentIndex = days.indexOf(prevDay);
              return days[(currentIndex + 1) % days.length];
            });
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / speedMultiplier);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const progressPercentage = (currentTime / 95) * 100;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Auto-select first person initially
  useEffect(() => {
    if (!selectedPerson && people.length > 0) {
      setSelectedPerson(people[0]);
    }
  }, [selectedPerson, people]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading simulation data...</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Left Section - Simulation */}
            <div className="flex-1">
              {/* Current Day and Time */}
              <div className="mb-6 font-bold text-lg">
                <p>Current Day: {currentDay}</p>
                <p>Current Time: {getTimeDisplay(currentTime)}</p>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-200 mb-6 w-full rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-blue-600 transition-all duration-300 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {/* Controls */}
              <div className="flex justify-between mb-8">
                <div className="flex space-x-4">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-600">Speed</label>
                    <Select value={speed} onValueChange={setSpeed}>
                      <SelectTrigger className="w-[100px] h-8 text-sm">
                        <SelectValue placeholder="1X" value={speed} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5x">0.5X</SelectItem>
                        <SelectItem value="1x">1X</SelectItem>
                        <SelectItem value="2x">2X</SelectItem>
                        <SelectItem value="4x">4X</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    className={`${isPlaying ? 'bg-gray-300' : 'bg-green-600'} text-white h-[40px] w-[100px] transition-colors`}
                    onClick={handlePlayPause}
                    disabled={isPlaying || people.length === 0}
                  >
                    ▶ Play
                  </Button>
                  <Button
                    className={`${!isPlaying ? 'bg-gray-300' : 'bg-orange-500'} text-white h-[40px] w-[100px] transition-colors`}
                    onClick={handlePlayPause}
                    disabled={!isPlaying}
                  >
                    ⏸ Pause
                  </Button>
                </div>
              </div>

              {people.length > 0 ? (
                <>
                  {/* Facility Cards with Hover Effects */}
                  <div className="grid grid-cols-3 gap-4 mb-12 mt-8">
                    {getLocationPeople().map((location, index) => (
                      <div key={index} className="relative group">
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-48">
                          <CardHeader className={`${location.color} py-3 px-4`}>
                            <CardTitle className={`${location.textColor} text-lg font-bold`}>
                              {location.location}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="relative p-4 h-32">
                            {/* Default view - People icons */}
                            <div className="flex flex-wrap gap-3 group-hover:opacity-0 transition-opacity duration-300">
                              {location.people.map((person, personIndex) => (
                                <div
                                  key={personIndex}
                                  className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity transform hover:scale-105"
                                  onClick={() => setSelectedPerson(person)}
                                >
                                  <Avatar className="h-12 w-12 mb-2">
                                    <AvatarFallback className="bg-gray-200 text-2xl">
                                      {person.emoji}
                                    </AvatarFallback>
                                  </Avatar>
                                  <Badge className="bg-gray-200 text-gray-800 text-xs font-normal">
                                    {person.name}
                                  </Badge>
                                </div>
                              ))}
                            </div>

                            {/* Hover view - AI Reasoning */}
                            <div className="absolute inset-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-lg">
                              {location.people.length > 0 ? (
                                <div className="space-y-3 h-full overflow-y-auto">
                                  {location.people.map((person, personIndex) => (
                                    <div key={personIndex} className="border-l-4 border-blue-500 pl-3">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-lg">{person.emoji}</span>
                                        <span className="font-medium text-sm text-gray-800">{person.name}</span>
                                      </div>
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        {getCurrentReasoning(person.id, currentTime)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                  <p className="text-sm">No active users</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>

                  {/* Current Facility Usage */}
                  <h2 className="text-lg font-bold text-gray-800 mb-5">
                    Current Facility Usage
                  </h2>

                  <div className="grid grid-cols-4 gap-4 mb-10">
                    {getFacilities().map((facility) => (
                      <Card key={facility.id} className="border-0 overflow-hidden shadow-lg">
                        <CardHeader className={`${facility.color} py-3 px-4`}>
                          <CardTitle className={`${facility.textColor} text-lg font-bold`}>
                            {facility.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-gray-800 mb-2">
                            {facility.users}
                          </div>
                          <div className="text-sm text-gray-600 mb-4">
                            Current Users
                          </div>
                          <Separator className="mb-3" />
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-gray-500 mb-2">Age Groups</div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">👦 10s </span>
                              <span className="text-gray-700 font-medium">
                                {facility.demographics.teens}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">👨 20s</span>
                              <span className="text-gray-700 font-medium">
                                {facility.demographics.twenties}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">👩‍💼 30s</span>
                              <span className="text-gray-700 font-medium">
                                {facility.demographics.thirties}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">👨‍🦳 40+</span>
                              <span className="text-gray-700 font-medium">
                                {facility.demographics.forties_plus}
                              </span>
                            </div>
                            
                            <div className="text-xs font-semibold text-gray-500 mb-2 mt-3">Gender</div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">♂️ Male</span>
                              <span className="text-gray-700 font-medium">
                                {facility.demographics.male}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">♀️ Female</span>
                              <span className="text-gray-700 font-medium">
                                {facility.demographics.female}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Enhanced Persona Analysis Section */}
                  <div className="bg-white rounded-lg shadow-lg p-6 h-[800px]">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <span className="mr-2">🧠</span>
                      AI Persona Analysis & Behavior Reasoning
                    </h2>
                    
                    {/* Persona Selector */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {people.map((person) => (
                        <button
                          key={person.id}
                          onClick={() => setSelectedPerson(person)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                            selectedPerson?.id === person.id 
                              ? 'bg-blue-100 border-blue-500 text-blue-700' 
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-lg">{person.emoji}</span>
                          <span className="font-medium">{person.details.english_name}</span>
                        </button>
                      ))}
                    </div>

                    {selectedPerson && (
                      <div className="grid grid-cols-2 gap-6 h-[600px]">
                        {/* Persona Details */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4 mb-4">
                            <Avatar className="h-16 w-16">
                              <AvatarFallback className="bg-blue-100 text-3xl">
                                {selectedPerson.emoji}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-bold">{selectedPerson.details.english_name}</h3>
                              <p className="text-gray-600">{selectedPerson.details.role} • Age {selectedPerson.details.age}</p>
                              <p className="text-sm text-gray-500">{selectedPerson.details.personality}</p>
                            </div>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Current Status</h4>
                            <p className="text-blue-700">
                              📍 Location: {getCurrentLocation(selectedPerson.id, currentTime)}
                            </p>
                            <p className="text-blue-700">
                              🕒 Time: {getTimeDisplay(currentTime)}
                            </p>
                          </div>

                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">🤖 Reasoning</h4>
                            <p className="text-sm text-green-700">
                              {getCurrentReasoning(selectedPerson.id, currentTime)}
                            </p>
                          </div>
                        </div>

                        {/* Schedule Timeline */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800">Daily Schedule</h4>
                          <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {selectedPerson.daily_schedule?.map((slot, idx) => {
                              const isCurrentSlot = getCurrentLocation(selectedPerson.id, currentTime) === slot.location && slot.location !== "No visit";
                              return (
                                <div 
                                  key={idx} 
                                  className={`border rounded-lg p-3 transition-all ${
                                    isCurrentSlot 
                                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                                      : 'border-gray-200 bg-white'
                                  }`}
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-gray-800">{slot.time_slot}</span>
                                    <div className={`px-3 py-1 rounded text-sm text-white ${slot.location_color}`}>
                                      {slot.location}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                    <strong>Why?:</strong> {slot.llm_reasoning}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">No Personas Available</h2>
                  <p className="text-gray-600 mb-6">
                    No personas found in {dataSource}. Please generate personas first using the Persona Generation page.
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={() => setDataSource('sample')}
                      className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700"
                    >
                      Load Sample Data
                    </Button>
                    <p className="text-sm text-gray-500">
                      Or generate new personas in the Persona Generation page and they will automatically appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Section - Info Cards */}
            <div className="w-[350px] space-y-4">
              {/* Simulation Status */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 py-4">
                  <CardTitle className="text-lg font-bold text-blue-800">
                    🎮 Simulation Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`text-sm font-medium ${isPlaying ? 'text-green-600' : 'text-orange-600'}`}>
                        {isPlaying ? '🟢 Running' : '🟡 Paused'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Speed:</span>
                      <span className="text-sm font-medium">{speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Participants:</span>
                      <span className="text-sm font-medium">{people.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Day:</span>
                      <span className="text-sm font-medium">{currentDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Data Source:</span>
                      <span className="text-sm font-medium">{dataSource}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {people.length > 0 && (
                <>
                  {/* Facility Analytics */}
                  <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 py-4">
                      <CardTitle className="text-lg font-bold text-green-800">
                        📊 Facility Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm">Most Popular Now</h4>
                          {(() => {
                            const locations = getLocationPeople().filter(l => l.location !== "No visit");
                            const sorted = locations.sort((a, b) => b.people.length - a.people.length);
                            const top = sorted[0];
                            return top ? (
                              <div className="flex items-center justify-between bg-amber-50 p-2 rounded">
                                <span className="text-sm font-medium">{top.location}</span>
                                <span className="text-sm text-amber-700">{top.people.length} users</span>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No active locations</p>
                            );
                          })()}
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm">Occupancy Rates</h4>
                          <div className="space-y-2">
                            {getLocationPeople()
                              .filter(l => l.location !== "No visit")
                              .map((location, idx) => {
                                const maxCapacity = 20;
                                const occupancyRate = (location.people.length / maxCapacity) * 100;
                                return (
                                  <div key={idx} className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600 truncate w-20">{location.location}</span>
                                    <div className="flex items-center space-x-2 flex-1 ml-2">
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div 
                                          className={`h-1.5 rounded-full ${
                                            occupancyRate > 75 ? 'bg-red-500' :
                                            occupancyRate > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                          }`}
                                          style={{width: `${Math.min(occupancyRate, 100)}%`}}
                                        ></div>
                                      </div>
                                      <span className="text-xs text-gray-500 w-8">{Math.round(occupancyRate)}%</span>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Technical Details */}
                  <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 py-4">
                      <CardTitle className="text-lg font-bold text-gray-800">
                        ⚙️ Technical Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">LLM Model:</span>
                          <span className="font-medium">GPT-4 Turbo</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Reasoning Engine:</span>
                          <span className="font-medium">Advanced</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Update Frequency:</span>
                          <span className="font-medium">Real-time</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Simulation Time:</span>
                          <span className="font-medium">{Math.floor(currentTime / 4)}h {(currentTime % 4) * 15}m</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Data Source:</span>
                          <span className="font-medium">{dataSource === 'localStorage' ? 'Generated' : 'Sample'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Data Management */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 py-4">
                  <CardTitle className="text-lg font-bold text-purple-800">
                    💾 Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Facilities:</span>
                        <span className="font-medium">{simulationData.facilities.length}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Personas:</span>
                        <span className="font-medium">{people.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Source:</span>
                        <span className="font-medium text-purple-700">{dataSource}</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => window.location.reload()}
                      className="w-full bg-purple-600 text-white py-2 hover:bg-purple-700 text-sm"
                    >
                      🔄 Refresh Data
                    </Button>
                    
                    {dataSource === 'localStorage' && people.length === 0 && (
                      <p className="text-xs text-gray-500 text-center">
                        Generate personas using the Persona Generation page
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
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