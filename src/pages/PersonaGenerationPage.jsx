import React, { useState, useEffect } from "react";
import StageTabs from "../components/StageTabs";
import { useNavigate } from "react-router-dom";
// Improved PersonaCard Component
const PersonaCard = ({ persona, onSelect, isSelected }) => {
  // Emoji mapping based on age and gender
  const getEmoji = (age, gender) => {
    if (age.includes("10s") && gender === "Male") return "👦";
    if (age.includes("10s") && gender === "Female") return "👧";
    if (age.includes("20s") && gender === "Male") return "👨";
    if (age.includes("20s") && gender === "Female") return "👩";
    if (age.includes("30s") && gender === "Male") return "👨";
    if (age.includes("30s") && gender === "Female") return "👩";
    if (age.includes("40s") && gender === "Male") return "👨‍🦱";
    if (age.includes("40s") && gender === "Female") return "👩‍🦱";
    if (age.includes("50s") && gender === "Male") return "👨‍🦳";
    if (age.includes("50s") && gender === "Female") return "👩‍🦳";
    if (age.includes("60s") && gender === "Male") return "👴";
    if (age.includes("60s") && gender === "Female") return "👵";
    return gender === "Male" ? "👨" : "👩";
  };

  // English name generator
  const getEnglishName = (gender, seed) => {
    const maleFirstNames = ["James", "William", "Mason", "Emma", "Ethan", "Michael", "Aiden", "Liam", "Noah", "Jackson"];
    const femaleFirstNames = ["Emma", "Olivia", "Ava", "Isabella", "Sophia", "Mia", "Charlotte", "Amelia", "Evelyn", "Abigail"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    
    const firstName = gender === "Male" 
      ? maleFirstNames[seed % maleFirstNames.length] 
      : femaleFirstNames[seed % femaleFirstNames.length];
    const lastName = lastNames[(seed * 3) % lastNames.length];
    
    return `${firstName} ${lastName}`;
  };

  // Card color based on personality
  const getCardColor = (personality) => {
    if (personality.includes("Social")) return "border-blue-300 bg-blue-50";
    if (personality.includes("Reserved")) return "border-green-300 bg-green-50";
    if (personality.includes("Analytical")) return "border-purple-300 bg-purple-50";
    if (personality.includes("Creative")) return "border-yellow-300 bg-yellow-50";
    if (personality.includes("Active")) return "border-red-300 bg-red-50";
    return "border-gray-300 bg-gray-50";
  };
  
  const emoji = getEmoji(persona.age_group, persona.gender);
  const name = persona.name || getEnglishName(persona.gender, persona.id ? parseInt(persona.id.split('_')[1]) : 0);
  const cardColor = getCardColor(persona.personality);

  return (
    <div 
      className={`border-2 rounded-lg p-4 transition-all ${cardColor} ${isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""}`}
      onClick={() => onSelect(persona)}
    >
      <div className="flex items-center mb-3">
        <div className="text-3xl mr-3">{emoji}</div>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{persona.age_group}, {persona.gender}</p>
        </div>
      </div>
      
      <div className="mb-3 text-gray-700 text-sm">
        <p className="mb-1">
          <span className="font-medium">Active Hours:</span> {persona.active_hours}
        </p>
        <p className="mb-1">
          <span className="font-medium">Personality:</span> {persona.personality}
        </p>
        <p className="mb-1">
          <span className="font-medium">Preferred Facilities:</span> {persona.preferred_facilities.join(", ")}
        </p>
      </div>
      
      <div className="bg-white p-3 rounded-lg text-sm italic">
        "{persona.profile_prompt.substring(0, 100)}..."
      </div>
    </div>
  );
};

export default function PersonaGenerationPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    gender: "Any",
    ageGroup: "Any",
    count: 5
  });
  
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPersonas, setSelectedPersonas] = useState([]);
  
  // 컴포넌트 최상위 레벨에 getEnglishName 함수 추가
  const getEnglishName = (gender, seed) => {
      const maleFirstNames = ["James", "William", "Mason", "Emma", "Ethan", "Michael", "Aiden", "Liam", "Noah", "Jackson"];
      const femaleFirstNames = ["Emma", "Olivia", "Ava", "Isabella", "Sophia", "Mia", "Charlotte", "Amelia", "Evelyn", "Abigail"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
      
      const firstName = gender === "Male" 
        ? maleFirstNames[seed % maleFirstNames.length] 
        : femaleFirstNames[seed % femaleFirstNames.length];
      const lastName = lastNames[(seed * 3) % lastNames.length];
      
      return `${firstName} ${lastName}`;
    };
  // Get facilities from localStorage
  const getFacilitiesFromStorage = () => {
    const storedFacilities = localStorage.getItem('simulationFacilities');
    if (storedFacilities) {
      try {
        const facilities = JSON.parse(storedFacilities);
        return facilities.map(f => f.name);
      } catch (e) {
        console.error("Error parsing facilities:", e);
        return [];
      }
    }
    return [];
  };
  
  // Options
  const ageGroupOptions = [
    "Any", "Under 10", "10s", "20s", "30s", "40s", "50s+"
  ];
  
  const genderOptions = ["Any", "Male", "Female"];
  
  // Default facilities (fallback if none provided)
  const defaultFacilities = [
    "Fitness Club", "Swimming Pool", "Sauna", "Library", "Golf Range", 
    "Screen Golf", "Billiards", "Table Tennis", "Tennis Court", "Cafe",
    "Kids Club", "Laundry", "Shared Kitchen", "Study Room", "Meeting Room"
  ];

  // Get available facilities
  const availableFacilities = getFacilitiesFromStorage().length > 0 
    ? getFacilitiesFromStorage() 
    : defaultFacilities;

  // Persona generation function
  const generatePersonas = () => {
    setLoading(true);
    
    // Generate sample persona data
    setTimeout(() => {
      const newPersonas = [];
      const count = filter.count;
      
      for (let i = 1; i <= count; i++) {
        const gender = filter.gender === "Any" 
          ? Math.random() > 0.5 ? "Male" : "Female"
          : filter.gender;
          
        const ageGroup = filter.ageGroup === "Any"
          ? ageGroupOptions[Math.floor(Math.random() * (ageGroupOptions.length - 1)) + 1]
          : filter.ageGroup;
        
        // Random facility selection (2-4 facilities)
        const facilitiesCount = Math.floor(Math.random() * 3) + 2; // 2-4
        const shuffledFacilities = [...availableFacilities].sort(() => 0.5 - Math.random());
        const preferredFacilities = shuffledFacilities.slice(0, facilitiesCount);
        
        // Random personality type
        const personalities = ["Social", "Reserved", "Analytical", "Creative", "Active", "Cautious", "Curious", "Systematic"];
        const personality = personalities[Math.floor(Math.random() * personalities.length)];
        
        // Random active hours
        const activeHours = ["Morning", "Afternoon", "Evening", "Night"][Math.floor(Math.random() * 4)];
        
        // Random distance sensitivity
        const distanceSensitivity = ["Very Sensitive", "Moderate", "Less Sensitive"][Math.floor(Math.random() * 3)];
        
        // Random family structure
        let familyStructure;
        if (ageGroup === "Under 10" || ageGroup === "10s") {
          familyStructure = "With Parents";
        } else if (ageGroup === "20s") {
          familyStructure = Math.random() > 0.7 ? "Single" : "With Parents";
        } else if (ageGroup === "30s") {
          familyStructure = Math.random() > 0.5 ? "Couple" : (Math.random() > 0.5 ? "Family with Kids" : "Single");
        } else {
          familyStructure = Math.random() > 0.3 ? "Family with Kids" : (Math.random() > 0.5 ? "Couple" : "Single");
        }
        
        // Random preferred days
        const preferredDays = ["Weekdays", "Weekends", "Any Day"][Math.floor(Math.random() * 3)];
        
        // Random usage frequency
        const usageFrequency = ["1-2 times/week", "3-4 times/week", "5+ times/week"][Math.floor(Math.random() * 3)];
        
        // Random route preference
        const routePreference = ["Shortest Path", "Quiet Route", "Indoor Preferred"][Math.floor(Math.random() * 3)];
        
        // Random tech affinity
        const techAffinity = ["App/Kiosk Friendly", "In-Person Preferred"][Math.floor(Math.random() * 2)];
        
        // Random block (1-5)
        const homeBlock = Math.floor(Math.random() * 5) + 1;
        
        // Generate profile prompt
        let profilePrompt = "";
        
        if (gender === "Male") {
          if (ageGroup === "Under 10" || ageGroup === "10s") {
            profilePrompt = `I'm an active ${ageGroup.toLowerCase()} boy who loves spending time at the ${preferredFacilities[0].toLowerCase()} and ${preferredFacilities[1].toLowerCase()} with friends. ${preferredDays === "Weekends" ? "On weekends" : "After school"}, I enjoy going out with my parents and meeting new people.`;
          } else if (ageGroup === "20s") {
            profilePrompt = `I'm a ${personality.toLowerCase()} ${ageGroup} male who often uses the ${preferredFacilities[0]} and ${preferredFacilities[1]}. I prefer ${activeHours.toLowerCase()} workouts and ${familyStructure === "Single" ? "I live alone, enjoying my freedom" : "I live with family while balancing work and leisure"}.`;
          } else {
            profilePrompt = `I'm a ${ageGroup} male with a ${personality.toLowerCase()} personality. ${familyStructure}, I ${preferredDays === "Weekends" ? "mainly visit on weekends" : preferredDays === "Weekdays" ? "mainly visit on weekdays" : "visit whenever I can"} the ${preferredFacilities[0]} and ${preferredFacilities[1]} about ${usageFrequency}.`;
          }
        } else {
          if (ageGroup === "Under 10" || ageGroup === "10s") {
            profilePrompt = `I'm a ${personality.toLowerCase()} ${ageGroup.toLowerCase()} girl. I enjoy visiting the ${preferredFacilities[0].toLowerCase()} and ${preferredFacilities[1].toLowerCase()} with my parents and meeting friends in the ${activeHours.toLowerCase()}.`;
          } else if (ageGroup === "20s" || ageGroup === "30s") {
            profilePrompt = `I'm a ${ageGroup} female ${familyStructure === "Single" ? "living independently" : "with family"} who has a ${personality.toLowerCase()} personality. I use the ${preferredFacilities[0]} and ${preferredFacilities[1]} ${usageFrequency} and ${techAffinity === "App/Kiosk Friendly" ? "love embracing new technology" : "prefer face-to-face interactions"}.`;
          } else {
            profilePrompt = `I'm a ${ageGroup} female who lives ${familyStructure.toLowerCase()}. ${personality} by nature, I enjoy visiting the ${preferredFacilities.join(', ')} during ${activeHours.toLowerCase()}. ${distanceSensitivity === "Very Sensitive" ? "I prefer nearby facilities" : distanceSensitivity === "Less Sensitive" ? "I don't mind traveling for quality facilities" : "I look for reasonably located facilities"}.`;
          }
        }
        
        // Create persona object
        const newPersona = {
          id: `persona_${i}_base`,
          age_group: ageGroup,
          gender: gender,
          home_block: homeBlock,
          active_hours: activeHours,
          preferred_facilities: preferredFacilities,
          distance_sensitivity: distanceSensitivity,
          personality: personality,
          family_structure: familyStructure,
          preferred_days: preferredDays,
          usage_frequency: usageFrequency,
          route_preference: routePreference,
          tech_affinity: techAffinity,
          profile_prompt: profilePrompt,
          variation_type: "base"
        };
        
        newPersonas.push(newPersona);
      }
      
      setPersonas(newPersonas);
      setLoading(false);
    }, 1500);
  };
  
  // Save selected personas for simulation
  const proceedToSimulation = () => {
    if (selectedPersonas.length === 0) {
      alert("Please select at least one persona for simulation.");
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('simulationPersonas', JSON.stringify(selectedPersonas));
    
    // Navigate to next page
    alert(`${selectedPersonas.length} personas saved for simulation!`);
    // For navigation, you would use: navigate('/simulation');
  };
  
  // Toggle persona selection
  const togglePersonaSelection = (persona) => {
    if (selectedPersonas.some(p => p.id === persona.id)) {
      setSelectedPersonas(selectedPersonas.filter(p => p.id !== persona.id));
    } else {
      setSelectedPersonas([...selectedPersonas, persona]);
    }
  };
  

  return (
    <div className="w-full bg-gray-50">
      {/* Navigation - Internal tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16">
            <button className="px-3 py-1 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
              Persona Generation
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Create Community Facility User Personas
        </h2>

        {/* Facility Alert */}
        {getFacilitiesFromStorage().length === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  No facilities found. Please design facilities first. Using default facility options.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Control Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Persona Generation Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={filter.gender}
                onChange={(e) => setFilter({...filter, gender: e.target.value})}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                {genderOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
              <select
                value={filter.ageGroup}
                onChange={(e) => setFilter({...filter, ageGroup: e.target.value})}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                {ageGroupOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Count</label>
              <input
                type="number"
                min="1"
                max="20"
                value={filter.count}
                onChange={(e) => setFilter({...filter, count: parseInt(e.target.value) || 5})}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={generatePersonas}
              disabled={loading}
              className="bg-[#002DAA] hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium"
            >
              {loading ? "Generating..." : "Generate Personas"}
            </button>
            
            <div className="text-sm text-gray-600">
              Selected: {selectedPersonas.length}
            </div>
          </div>
        </div>

        {/* Selected Personas Section */}
        {selectedPersonas.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Selected Personas</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPersonas.map(persona => (
                <div key={persona.id} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {persona.gender === "Male" ? "👨" : "👩"} {persona.name || getEnglishName(persona.gender, parseInt(persona.id.split('_')[1]))}
                  <button
                    onClick={() => togglePersonaSelection(persona)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <button
                onClick={() => navigate("/simulation")}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-medium"
              >
                Proceed to Simulation
              </button>
            </div>
          </div>
        )}

        {/* Persona Cards Grid */}
        {personas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                onSelect={togglePersonaSelection}
                isSelected={selectedPersonas.some(p => p.id === persona.id)}
              />
            ))}
          </div>
        ) : !loading && (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <p className="text-gray-600">
              Generate personas with the options set above.
              <br />
              Generated personas will appear here.
            </p>
          </div>
        )}
        
        {loading && (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <p className="mt-4 text-gray-500">Generating personas...</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 h-12 flex items-center justify-between px-8 text-sm text-[#666666]">
        <div>Persona Generation Dashboard v1.0</div>
        <div>Developed by Suhyeon Lee</div>
      </footer>
    </div>
  );
}