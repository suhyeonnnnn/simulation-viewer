import React, { useState, useEffect } from 'react';

// Custom UI Components - Standalone versions without shadcn/ui
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

const SelectTrigger = ({ children, className = '', onClick, isOpen }) => (
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

const SelectContent = ({ children, onSelect, isOpen, value }) => {
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

export default function LLMSimulator() {
  // State for simulation
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState('1x');
  const [currentDay, setCurrentDay] = useState('Mon');
  const [selectedPerson, setSelectedPerson] = useState(null);
  
  // People data with English details
  const people = [
    { 
      id: 1, 
      name: "Jane", 
      emoji: "👱", 
      persona: "staff",
      details: {
        englishName: "Jane",
        role: "Building Manager",
        age: 32,
        description: "Manages building operations and coordinates with various departments."
      }
    },
    { 
      id: 2, 
      name: "Sue", 
      emoji: "👧", 
      persona: "staff",
      details: {
        englishName: "Sue",
        role: "Receptionist",
        age: 24,
        description: "Front desk operations and visitor assistance."
      }
    },
    { 
      id: 3, 
      name: "Sana", 
      emoji: "👩", 
      persona: "visitor",
      details: {
        englishName: "Sana",
        role: "Guest",
        age: 28,
        description: "Visiting the building for meetings and events."
      }
    },
    { 
      id: 4, 
      name: "Edgar", 
      emoji: "👨", 
      persona: "researcher",
      details: {
        englishName: "Edgar",
        role: "Data Scientist",
        age: 35,
        description: "Conducts research in machine learning and AI."
      }
    },
    { 
      id: 5, 
      name: "Mel", 
      emoji: "👩", 
      persona: "researcher",
      details: {
        englishName: "Mel",
        role: "Research Fellow",
        age: 29,
        description: "Specializes in computational biology research."
      }
    },
    { 
      id: 6, 
      name: "Juneha", 
      emoji: "👶", 
      persona: "student",
      details: {
        englishName: "Juneha",
        role: "Graduate Student",
        age: 24,
        description: "Pursuing PhD in Computer Science."
      }
    },
    { 
      id: 7, 
      name: "Yun", 
      emoji: "👩", 
      persona: "professional",
      details: {
        englishName: "Yun",
        role: "Software Engineer",
        age: 31,
        description: "Develops software solutions for enterprise clients."
      }
    },
    { 
      id: 8, 
      name: "Hyu", 
      emoji: "👨", 
      persona: "professional",
      details: {
        englishName: "Hyu",
        role: "Product Manager",
        age: 34,
        description: "Manages product development and strategy."
      }
    },
  ];

  // Timeline data
  const timelineData = [
    {
      persona: "🧑 Student",
      key: "student",
      schedule: [
        { time: "8:00-10:00", location: "Library", color: "bg-blue-500" },
        { time: "10:00-12:00", location: "Cafe", color: "bg-amber-400" },
        { time: "12:00-16:00", location: "Library", color: "bg-blue-500" },
        { time: "16:00-18:00", location: "Gym", color: "bg-red-500" },
        { time: "18:00-20:00", location: "Lounge", color: "bg-purple-500" },
      ],
    },
    {
      persona: "👔 Professional",
      key: "professional",
      schedule: [
        { time: "8:00-10:00", location: "Cafe", color: "bg-amber-400" },
        { time: "10:00-12:00", location: "Conference Room", color: "bg-green-500" },
        { time: "12:00-14:00", location: "Cafe", color: "bg-amber-400" },
        { time: "14:00-18:00", location: "Conference Room", color: "bg-green-500" },
        { time: "18:00-20:00", location: "Gym", color: "bg-red-500" },
      ],
    },
    {
      persona: "🔬 Researcher",
      key: "researcher",
      schedule: [
        { time: "8:00-10:00", location: "Library", color: "bg-blue-500" },
        { time: "10:00-12:00", location: "Conference Room", color: "bg-green-500" },
        { time: "12:00-14:00", location: "Cafe", color: "bg-amber-400" },
        { time: "14:00-18:00", location: "Library", color: "bg-blue-500" },
        { time: "18:00-20:00", location: "Lounge", color: "bg-purple-500" },
      ],
    },
    {
      persona: "🧳 Visitor",
      key: "visitor",
      schedule: [
        { time: "8:00-10:00", location: "No visit", color: "" },
        { time: "10:00-12:00", location: "Conference Room", color: "bg-green-500" },
        { time: "12:00-14:00", location: "Cafe", color: "bg-amber-400" },
        { time: "14:00-16:00", location: "Lounge", color: "bg-purple-500" },
        { time: "16:00-18:00", location: "Library", color: "bg-blue-500" },
      ],
    },
    {
      persona: "🛠 Staff",
      key: "staff",
      schedule: [
        { time: "8:00-12:00", location: "Cafe", color: "bg-amber-400" },
        { time: "12:00-16:00", location: "Cafe", color: "bg-amber-400" },
        { time: "16:00-18:00", location: "Conference Room", color: "bg-green-500" },
        { time: "18:00-20:00", location: "Lounge", color: "bg-purple-500" },
        { time: "20:00-22:00", location: "Gym", color: "bg-red-500" },
      ],
    },
  ];

  const timeLabels = [
    "8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"
  ];

  // Get current location for a persona based on time
  const getCurrentLocation = (persona, time) => {
    const hourFraction = time / 4;
    const hour = Math.floor(hourFraction + 8);
    
    const personaData = timelineData.find(data => data.key === persona);
    if (!personaData) return "No visit";

    for (const slot of personaData.schedule) {
      const [start, end] = slot.time.split('-');
      const startHour = parseInt(start.split(':')[0]);
      const endHour = parseInt(end.split(':')[0]);
      
      if (hour >= startHour && hour < endHour) {
        return slot.location || "No visit";
      }
    }
    return "No visit";
  };

  // Calculate grouped location data
  const getLocationPeople = () => {
    const locations = [
      { location: "No visit", color: "bg-black", textColor: "text-white", bgLight: "bg-black" },
      { location: "Cafe", color: "bg-amber-400", textColor: "text-white", bgLight: "bg-amber-100" },
      { location: "Gym", color: "bg-red-500", textColor: "text-white", bgLight: "bg-red-100" },
      { location: "Library", color: "bg-blue-500", textColor: "text-white", bgLight: "bg-blue-100" },
      { location: "Conference Room", color: "bg-green-500", textColor: "text-white", bgLight: "bg-green-100" },
      { location: "Lounge", color: "bg-purple-500", textColor: "text-white", bgLight: "bg-purple-100" },
    ];

    return locations.map(loc => ({
      ...loc,
      people: people.filter(person => getCurrentLocation(person.persona, currentTime) === loc.location)
    }));
  };

  // Data for facilities
  const getFacilities = () => {
    const facilities = [
      {
        id: 1,
        name: "Cafe",
        color: "bg-amber-400",
        textColor: "text-white",
      },
      {
        id: 2,
        name: "Gym",
        color: "bg-red-500",
        textColor: "text-white",
      },
      {
        id: 3,
        name: "Library",
        color: "bg-blue-500",
        textColor: "text-white",
      },
      {
        id: 4,
        name: "Conference Room",
        color: "bg-green-500",
        textColor: "text-white",
      },
      {
        id: 5,
        name: "Lounge",
        color: "bg-purple-500",
        textColor: "text-white",
      },
    ];

    // Calculate current occupancy
    const locations = getLocationPeople();
    
    return facilities.map(facility => {
      const location = locations.find(loc => loc.location === facility.name);
      const users = location ? location.people.length : 0;
      
      // Calculate persona distribution
      const personas = {
        student: 0,
        professional: 0,
        researcher: 0,
        visitor: 0,
        staff: 0,
      };
      
      if (location) {
        location.people.forEach(person => {
          personas[person.persona] = (personas[person.persona] || 0) + 1;
        });
      }
      
      return {
        ...facility,
        users,
        personas
      };
    });
  };

  // Convert time to display format
  const getTimeDisplay = (timeIndex) => {
    const hour = Math.floor(timeIndex / 4) + 8;
    const minute = (timeIndex % 4) * 15;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  // Simulation logic
  useEffect(() => {
    let interval;
    
    if (isPlaying) {
      const speedMultiplier = parseFloat(speed.replace('x', ''));
      interval = setInterval(() => {
        setCurrentTime(prev => (prev + 1) % 96);
      }, 1000 / speedMultiplier);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const progressPercentage = (currentTime / 95) * 100;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  useEffect(() => {
    // Cycle through days every 24 hours (96 intervals)
    if (currentTime === 0) {
      setCurrentDay(days[(days.indexOf(currentDay) + 1) % days.length]);
    }
  }, [currentTime]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header */}
      <header className="bg-[#002DAA] h-24 w-full flex items-center">
        <div className="flex items-center ml-8">
          <span className="text-white text-2xl font-bold mr-3">🤖</span>
          <h1 className="text-white text-2xl font-bold font-inter-bold">
            LLM Facilities Simulator
          </h1>
        </div>
      </header>

      {/* Project Info Banner */}
      <div className="bg-[#002DAA] bg-opacity-10 py-3 px-8 text-[#002DAA] text-sm">
        This project was created as part of the KAIST-CMU Visiting Program
      </div>

      {/* Main Content - Now wider */}
      <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full">
        <div className="flex gap-6">
          {/* Left Section - Simulation */}
          <div className="flex-1">
            {/* Current Day and Time */}
            <div className="mb-6 font-inter-bold font-bold text-[#212121] text-lg">
              <p>Current Day: {currentDay}</p>
              <p>Current Time: {getTimeDisplay(currentTime)}</p>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-200 mb-6 w-full">
              <div 
                className="absolute h-full bg-blue-600" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Controls */}
            <div className="flex justify-between mb-8">
              <div className="flex space-x-6">
                {/* Filters */}
                <div className="space-y-1">
                  <label className="text-sm text-[#616161] font-inter-regular">
                    Time Range
                  </label>
                  <Select defaultValue="24hours">
                    <SelectTrigger className="w-[128px] h-8 text-sm">
                      <SelectValue placeholder="24 Hours" value="24 Hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24hours">24 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-[#616161] font-inter-regular">
                    Facilities
                  </label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[128px] h-8 text-sm">
                      <SelectValue placeholder="All Facilities" value="All Facilities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Facilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-[#616161] font-inter-regular">
                    Personas
                  </label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[128px] h-8 text-sm">
                      <SelectValue placeholder="All Personas" value="All Personas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Personas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-[#616161] font-inter-regular">
                    View Mode
                  </label>
                  <Select defaultValue="timeline">
                    <SelectTrigger className="w-[128px] h-8 text-sm">
                      <SelectValue placeholder="Timeline" value="Timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="timeline">Timeline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-[#616161] font-inter-regular">
                    Speed
                  </label>
                  <Select value={speed} onValueChange={setSpeed}>
                    <SelectTrigger className="w-[128px] h-8 text-sm">
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

              {/* Play/Pause Buttons */}
              <div className="flex space-x-3">
                <Button
                  className={`${isPlaying ? 'bg-gray-300' : 'bg-black'} text-white h-[50px] w-[110px]`}
                  onClick={handlePlayPause}
                  disabled={isPlaying}
                >
                  <span className="font-bold text-sm">Play</span>
                </Button>
                <Button
                  className={`${!isPlaying ? 'bg-gray-300' : 'bg-white'} text-[#fbbc05] h-[50px] w-[110px] border border-gray-300`}
                  onClick={handlePlayPause}
                  disabled={!isPlaying}
                >
                  <span className="font-bold text-sm">Pause</span>
                </Button>
              </div>
            </div>

            {/* Facility Cards */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              {getLocationPeople().map((location, index) => (
                <Card
                  key={index}
                  className={`border-0 overflow-hidden`}
                >
                  <CardHeader
                    className={`${location.color} py-3 px-5`}
                  >
                    <CardTitle
                      className={`${location.textColor} text-lg font-bold`}
                    >
                      {location.location}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3 p-5">
                    {location.people.map((person, personIndex) => (
                      <div
                        key={personIndex}
                        className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedPerson(person)}
                      >
                        <Avatar className="h-12 w-12 mb-2">
                          <AvatarFallback className="bg-gray-200 text-[#daa520] text-2xl">
                            {person.emoji}
                          </AvatarFallback>
                        </Avatar>
                        <Badge
                          className="bg-gray-200 text-[#1e1e1e] text-xs font-normal"
                        >
                          {person.name}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Current Facility Usage */}
            <h2 className="text-lg font-bold font-inter-bold text-[#212121] mb-5">
              Current Facility Usage
            </h2>

            <div className="grid grid-cols-5 gap-5 mb-10">
              {getFacilities().map((facility) => (
                <Card key={facility.id} className="border-0 overflow-hidden">
                  <CardHeader className={`${facility.color} py-3 px-5`}>
                    <CardTitle
                      className={`${facility.textColor} text-lg font-bold`}
                    >
                      {facility.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="text-2xl font-bold font-inter-bold text-[#212121] mb-2">
                      {facility.users}
                    </div>
                    <div className="text-sm text-[#757575] font-inter-regular mb-5">
                      Current Users
                    </div>
                    <Separator className="mb-3" />
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#212121]">🧑 Student</span>
                        <span className="text-[#212121]">
                          {facility.personas.student}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#212121]">👔 Professional</span>
                        <span className="text-[#212121]">
                          {facility.personas.professional}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#212121]">🔬 Researcher</span>
                        <span className="text-[#212121]">
                          {facility.personas.researcher}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#212121]">🧳 Visitor</span>
                        <span className="text-[#212121]">
                          {facility.personas.visitor}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#212121]">🛠 Staff</span>
                        <span className="text-[#212121]">
                          {facility.personas.staff}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Persona Daily Timelines */}
            <h2 className="text-lg font-bold font-inter-bold text-[#212121] mb-5">
              Persona Daily Timelines
            </h2>

            <div className="relative mb-10">
              {/* Time labels */}
              <div className="flex justify-between mb-3">
                {timeLabels.map((time, index) => (
                  <div
                    key={index}
                    className="text-sm text-[#9e9e9e] text-center"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Timeline rows */}
              <div className="space-y-3">
                {timelineData.map((row, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-40 text-sm text-[#212121] font-inter-regular">
                      {row.persona}
                    </div>
                    <div className="flex-1 flex">
                      {row.schedule.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className={`${slot.color} h-7 relative flex-1 flex items-center justify-center`}
                        >
                          {slot.location && slot.location !== "No visit" && (
                            <span className="text-sm text-white text-center whitespace-nowrap">
                              {slot.location}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Persona Info Card */}
          <div className="w-[400px]">
            {selectedPerson ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-gray-200 text-[#daa520] text-3xl">
                          {selectedPerson.emoji}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{selectedPerson.details.englishName}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedPerson.details.role} • Age {selectedPerson.details.age}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPerson(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                      <p className="text-gray-600">{selectedPerson.details.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Current Activity</h4>
                      <p className="text-gray-600">
                        Currently at: {getCurrentLocation(selectedPerson.persona, currentTime)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Today's Schedule</h4>
                      <div className="space-y-2">
                        {timelineData
                          .find(t => t.key === selectedPerson.persona)
                          ?.schedule.map((slot, idx) => (
                            <div 
                              key={idx} 
                              className={`p-2 rounded text-sm ${slot.color} text-white`}
                            >
                              <span className="font-medium">{slot.time}</span>: {slot.location}
                              </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-4">
                <CardContent className="py-16 text-center text-gray-500">
                  Click on a person to see their details
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 h-12 flex items-center justify-between px-8 text-sm text-[#666666]">
        <div>LLM Facilities Simulation v1.0</div>
        <div>Made by Suhyeon Lee</div>
      </footer>
    </div>
  );
}