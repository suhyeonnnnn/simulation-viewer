import React, { useState, useEffect } from 'react';
import StageTabs from "../components/StageTabs";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  // State for simulation
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState('1x');
  const [currentDay, setCurrentDay] = useState('Mon');
  const [selectedPerson, setSelectedPerson] = useState(null);
  
  // People data with English details and individual schedules
  const people = [
    { 
      id: 1, 
      name: "Jane", 
      emoji: "👱", 
      persona: "staff",
      details: {
        englishName: "Jane",
        role: "Building Owner",
        age: 22,
        description: "Manages building operations and coordinates with various departments."
      },
      schedule: [
        { time: "8:00-9:00", location: "Office", color: "bg-gray-600" },
        { time: "9:00-12:00", location: "Cafe", color: "bg-amber-400" },
        { time: "12:00-13:00", location: "Cafe", color: "bg-amber-400" },
        { time: "13:00-17:00", location: "Conference Room", color: "bg-green-500" },
        { time: "17:00-18:00", location: "Office", color: "bg-gray-600" },
      ]
    },
    { 
      id: 2, 
      name: "Sue", 
      emoji: "👧", 
      persona: "staff",
      details: {
        englishName: "Sue",
        role: "Cute Idol",
        age: 24,
        description: "Front desk operations and visitor assistance."
      },
      schedule: [
        // { time: "8:00-12:00", location: "Reception", color: "bg-amber-400" },
        { time: "12:00-13:00", location: "Study Room", color: "bg-amber-400" },
        // { time: "13:00-17:00", location: "Reception", color: "bg-amber-400" },
        { time: "17:00-18:00", location: "Gym", color: "bg-purple-500" },
        { time: "18:00-19:00", location: "Study Room", color: "bg-red-500" },
      ]
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
      },
      schedule: [
        { time: "8:00-10:00", location: "No visit", color: "" },
        { time: "10:00-12:00", location: "Conference Room", color: "bg-green-500" },
        { time: "12:00-13:00", location: "Cafe", color: "bg-amber-400" },
        { time: "13:00-15:00", location: "Lounge", color: "bg-purple-500" },
        { time: "15:00-17:00", location: "Conference Room", color: "bg-green-500" },
      ]
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
      },
      schedule: [
        { time: "8:00-10:00", location: "Library", color: "bg-blue-500" },
        { time: "10:00-12:00", location: "Lab", color: "bg-indigo-500" },
        { time: "12:00-13:00", location: "Cafe", color: "bg-amber-400" },
        { time: "13:00-17:00", location: "Library", color: "bg-blue-500" },
        { time: "17:00-19:00", location: "Lab", color: "bg-indigo-500" },
      ]
    },
    { 
      id: 5, 
      name: "Mel", 
      emoji: "👩", 
      persona: "researcher",
      details: {
        englishName: "Mel",
        role: "Research Fellow",
        age: 23,
        description: "Specializes in computational biology research."
      },
      schedule: [
        { time: "8:00-10:00", location: "Lab", color: "bg-indigo-500" },
        { time: "10:00-12:00", location: "Conference Room", color: "bg-green-500" },
        { time: "12:00-13:00", location: "Cafe", color: "bg-amber-400" },
        { time: "13:00-16:00", location: "Lab", color: "bg-indigo-500" },
        { time: "16:00-19:00", location: "Library", color: "bg-blue-500" },
      ]
    },
    { 
      id: 6, 
      name: "Juneha", 
      emoji: "👶", 
      persona: "student",
      details: {
        englishName: "Juneha",
        role: "PhD Student",
        age: 21,
        description: "He is PhD Student in informationi systems"
      },
      schedule: [
        // { time: "8:00-12:00", location: "Reception", color: "bg-amber-400" },
        { time: "12:00-13:00", location: "Study Room", color: "bg-amber-400" },
        // { time: "13:00-17:00", location: "Reception", color: "bg-amber-400" },
        { time: "17:00-18:00", location: "Gym", color: "bg-purple-500" },
        { time: "18:00-19:00", location: "Study Room", color: "bg-red-500" },
      ]
    },
    { 
      id: 7, 
      name: "Yun", 
      emoji: "👩", 
      persona: "professional",
      details: {
        englishName: "Yun",
        role: "Software Engineer",
        age: 21,
        description: "Develops software solutions for enterprise clients."
      },
      schedule: [
        { time: "8:00-10:00", location: "Cafe", color: "bg-amber-400" },
        { time: "10:00-12:00", location: "Conference Room", color: "bg-green-500" },
        { time: "12:00-13:00", location: "Cafe", color: "bg-amber-400" },
        { time: "13:00-18:00", location: "Office", color: "bg-gray-600" },
        { time: "18:00-19:00", location: "Gym", color: "bg-red-500" },
      ]
    },
    { 
      id: 8, 
      name: "Hyu", 
      emoji: "👨", 
      persona: "professional",
      details: {
        englishName: "Hyu",
        role: "Product Manager",
        age: 24,
        description: "Manages product development and strategy."
      },
      schedule: [
        { time: "8:00-9:00", location: "Cafe", color: "bg-amber-400" },
        { time: "9:00-12:00", location: "Conference Room", color: "bg-green-500" },
        { time: "12:00-13:00", location: "Cafe", color: "bg-amber-400" },
        { time: "13:00-17:00", location: "Conference Room", color: "bg-green-500" },
        { time: "17:00-19:00", location: "Office", color: "bg-gray-600" },
      ]
    },
    { 
      id: 9, 
      name: "Edward", 
      emoji: "👦", 
      persona: "High school student",
      details: {
        englishName: "Edward",
        role: "Student",
        age: 18,
        description: "Attends high school and prepares for university entrance exams."
      },
      schedule: [
        { time: "8:00-9:00", location: "Study Room", color: "bg-teal-500" },
        { time: "9:00-15:00", location: "Conference Room", color: "bg-green-500" },
        { time: "15:00-17:00", location: "Library", color: "bg-blue-500" },
        { time: "17:00-19:00", location: "Lounge", color: "bg-purple-500" },
      ]
    },
    { 
      id: 10, 
      name: "Regina", 
      emoji: "👩", 
      persona: "Homemaker",
      details: {
        englishName: "Regina",
        role: "Homemaker",
        age: 38,
        description: "Manages household responsibilities and takes care of her family."
      },
      schedule: [
        { time: "8:00-9:00", location: "Cafe", color: "bg-amber-400" },
        { time: "9:00-12:00", location: "Reception", color: "bg-amber-400" },
        { time: "12:00-13:00", location: "Cafe", color: "bg-amber-400" },
        { time: "13:00-15:00", location: "Lounge", color: "bg-purple-500" },
        { time: "15:00-18:00", location: "Office", color: "bg-gray-600" },
      ]
    },
    { 
      id: 11, 
      name: "Michel", 
      emoji: "👨‍🍳", 
      persona: "Chef",
      details: {
        englishName: "Michel",
        role: "Chef",
        age: 35,
        description: "Prepares meals in a restaurant and manages kitchen staff."
      },
      schedule: [
        { time: "8:00-10:00", location: "Reception", color: "bg-amber-400" },
        { time: "10:00-14:00", location: "Lab", color: "bg-indigo-500" },
        { time: "14:00-16:00", location: "Lounge", color: "bg-purple-500" },
        { time: "16:00-21:00", location: "Lab", color: "bg-indigo-500" },
      ]
    }
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

  // Get current location for a person based on their individual schedule
  const getCurrentLocation = (personId, time) => {
    const hourFraction = time / 4;
    const hour = Math.floor(hourFraction + 8);
    
    const person = people.find(p => p.id === personId);
    if (!person || !person.schedule) return "No visit";

    for (const slot of person.schedule) {
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
      { location: "Lab", color: "bg-indigo-500", textColor: "text-white", bgLight: "bg-indigo-100" },
      { location: "Office", color: "bg-gray-600", textColor: "text-white", bgLight: "bg-gray-100" },
      { location: "Reception", color: "bg-amber-400", textColor: "text-white", bgLight: "bg-amber-100" },
      { location: "Study Room", color: "bg-teal-500", textColor: "text-white", bgLight: "bg-teal-100" },
    ];

    return locations.map(loc => ({
      ...loc,
      people: people.filter(person => getCurrentLocation(person.id, currentTime) === loc.location)
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

  // Get current facility status
  const getFacilityStatus = () => {
    const hour = Math.floor(currentTime / 4) + 8;
    return getFacilities().map(facility => ({
      ...facility,
      isOpen: hour >= 8 && hour < 22, // All facilities open 8AM-10PM
      openingTime: "8:00 AM",
      closingTime: "10:00 PM"
    }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col">


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

          {/* Right Section - Info Cards */}
          <div className="w-[400px] space-y-6">
            {/* Simulation Details Card */}
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 py-4">
                <CardTitle className="text-lg font-bold text-[#002DAA]">
                  Simulation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Week Day</h4>
                    <p className="text-gray-600">{currentDay} - {days[days.indexOf(currentDay) + 6 < days.length ? days[days.indexOf(currentDay) + 6] : days[days.indexOf(currentDay) + 6 - 7]]}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Current Capacity</h4>
                    <p className="text-gray-600">{people.length} participants</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Building Hours</h4>
                    <p className="text-gray-600">8:00 AM - 10:00 PM</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Simulation Status</h4>
                    <p className={`text-${isPlaying ? 'green' : 'red'}-600 font-medium`}>
                      {isPlaying ? 'Running' : 'Paused'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facilities Status Card */}
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 py-4">
                <CardTitle className="text-lg font-bold text-[#006400]">
                  Facilities Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {getFacilityStatus().map((facility) => {
                    const hour = Math.floor(currentTime / 4) + 8;
                    const isOpen = hour >= 8 && hour < 22;
                    return (
                      <div key={facility.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-gray-700">{facility.name}</span>
                        </div>
                        <span className={`text-sm font-medium ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
                          {isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Persona Info Card */}
            {selectedPerson ? (
              <Card className="shadow-md">
                <CardHeader className={`${
                  selectedPerson.persona === 'student' ? 'bg-gradient-to-r from-blue-50 to-blue-100' :
                  selectedPerson.persona === 'professional' ? 'bg-gradient-to-r from-purple-50 to-purple-100' :
                  selectedPerson.persona === 'researcher' ? 'bg-gradient-to-r from-green-50 to-green-100' :
                  selectedPerson.persona === 'visitor' ? 'bg-gradient-to-r from-orange-50 to-orange-100' :
                  'bg-gradient-to-r from-gray-50 to-gray-100'
                } py-4`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-white text-[#daa520] text-3xl">
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
                      className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                      ×
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                      <p className="text-gray-600">{selectedPerson.details.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Current Activity</h4>
                      <p className="text-gray-600">
                        Currently at: {getCurrentLocation(selectedPerson.id, currentTime)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Today's Schedule</h4>
                      <div className="space-y-2">
                        {selectedPerson.schedule?.map((slot, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3 rounded text-sm ${slot.color} text-white flex justify-between items-center`}
                          >
                            <span className="font-medium">{slot.time}</span>
                            <span>{slot.location}</span>
                          </div>
                        ))
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-md">
                <CardContent className="py-20 text-center text-gray-500">
                  <div className="space-y-2">
                    <div className="text-gray-400 text-4xl">👆</div>
                    <p>Click on a person to see their details</p>
                  </div>
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