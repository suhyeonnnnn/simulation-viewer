import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StageTabs from "../components/StageTabs";

// PersonaCard Component
const PersonaCard = ({ persona, onSelect, isSelected }) => {
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

  const getCardColor = (personality) => {
    if (personality.includes("Social")) return "border-blue-300 bg-blue-50";
    if (personality.includes("Reserved")) return "border-green-300 bg-green-50";
    if (personality.includes("Analytical")) return "border-purple-300 bg-purple-50";
    if (personality.includes("Creative")) return "border-yellow-300 bg-yellow-50";
    if (personality.includes("Active")) return "border-red-300 bg-red-50";
    return "border-gray-300 bg-gray-50";
  };
  
  const emoji = persona.emoji || getEmoji(persona.details?.age_group || persona.age_group, persona.details?.gender || persona.gender);
  const name = persona.details?.english_name || persona.name || persona.details?.name || "";
  const role = persona.details?.role || "";
  const age = persona.details?.age || (persona.details?.age_group || persona.age_group || "").replace("s", "").replace("+", "") || "";
  const personality = persona.details?.personality || persona.personality || "";
  const cardColor = getCardColor(personality);
  
  // 활동 시간이 세부 정보에 있거나 메인 객체에 있는지 확인
  const activeHours = persona.active_hours || "";
  
  // 시설 정보는 여러 가지 형태로 있을 수 있음
  const facilities = persona.preferred_facilities 
    ? Array.isArray(persona.preferred_facilities) 
      ? persona.preferred_facilities.join(", ")
      : persona.preferred_facilities
    : "";
  
  // 페르소나 설명 정보
  const description = persona.profile_prompt || persona.details?.description || "";

  return (
    <div 
      className={`border-2 rounded-lg p-4 transition-all ${cardColor} ${isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""} cursor-pointer hover:shadow-md`}
      onClick={() => onSelect(persona)}
    >
      <div className="flex items-center mb-3">
        <div className="text-3xl mr-3">{emoji}</div>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">
            {role && `${role}, `}{age && `Age ${age}, `}
            {(persona.details?.gender || persona.gender || "")}
          </p>
        </div>
      </div>
      
      <div className="mb-3 text-gray-700 text-sm">
        {activeHours && (
          <p className="mb-1">
            <span className="font-medium">Active Hours:</span> {activeHours}
          </p>
        )}
        {personality && (
          <p className="mb-1">
            <span className="font-medium">Personality:</span> {personality}
          </p>
        )}
        {facilities && (
          <p className="mb-1">
            <span className="font-medium">Preferred Facilities:</span> {facilities}
          </p>
        )}
      </div>
      
      {description && (
        <div className="bg-white p-3 rounded-lg text-sm italic">
          "{description.substring(0, 120)}..."
        </div>
      )}
    </div>
  );
};

export default function PersonaGenerationPage() {
  // React Router의 useNavigate 훅 사용
  const navigate = useNavigate();

  // LLM 설정
  const [llmSettings, setLlmSettings] = useState({
    provider: "openai",
    model: "gpt-4-turbo",
    apiKey: "",
    temperature: 0.7,
    maxTokens: 1000
  });

  // 페르소나 필터링
  const [filter, setFilter] = useState({
    gender: "Any",
    ageGroup: "Any",
    count: 5,
    personaType: "Any"
  });
  
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPersonas, setSelectedPersonas] = useState([]);
  const [availableFacilities, setAvailableFacilities] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyHidden, setApiKeyHidden] = useState(true);
  
  useEffect(() => {
    // localStorage에서 저장된 LLM 설정 불러오기
    const savedSettings = localStorage.getItem('llmSettings');
    if (savedSettings) {
      try {
        setLlmSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Error parsing LLM settings:", e);
      }
    }
    
    // localStorage에서 시설 정보 불러오기
    const storedFacilities = localStorage.getItem('simulationFacilities');
    if (storedFacilities) {
      try {
        const data = JSON.parse(storedFacilities);
        // 'facilities' 배열이 존재하는 경우
        if (data.facilities && Array.isArray(data.facilities)) {
          setAvailableFacilities(data.facilities.map(f => f.name));
        } 
        // 직접 배열인 경우 (다른 형식으로 저장된 경우 대비)
        else if (Array.isArray(data)) {
          setAvailableFacilities(data.map(f => f.name));
        }
      } catch (e) {
        console.error("Error parsing facilities:", e);
        setAvailableFacilities([]);
      }
    }
  }, []);
  
  // LLM 설정 저장
  const saveLlmSettings = () => {
    localStorage.setItem('llmSettings', JSON.stringify(llmSettings));
    setShowSettings(false);
    alert("LLM settings saved successfully!");
  };
  
  // 나이 그룹 옵션
  const ageGroupOptions = [
    "Any", "Under 10", "10s", "20s", "30s", "40s", "50s+"
  ];
  
  // 성별 옵션
  const genderOptions = ["Any", "Male", "Female"];
  
  // 페르소나 유형 옵션
  const personaTypeOptions = [
    "Any", "student", "professional", "researcher", "visitor", "staff"
  ];
  
  // LLM 제공 업체 옵션
  const llmProviderOptions = [
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "google", label: "Google AI" }
  ];
  
  // 각 제공업체별 모델 옵션
  const getModelOptions = (provider) => {
    switch (provider) {
      case "openai":
        return [
          { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
          { value: "gpt-4", label: "GPT-4" },
          { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" }
        ];
      case "anthropic":
        return [
          { value: "claude-3-opus", label: "Claude 3 Opus" },
          { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
          { value: "claude-3-haiku", label: "Claude 3 Haiku" }
        ];
      case "google":
        return [
          { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
          { value: "gemini-1.0-pro", label: "Gemini 1.0 Pro" }
        ];
      default:
        return [];
    }
  };
  
  // 기본 시설 (시설 데이터가 없을 경우 대체)
  const defaultFacilities = [
    "Cafe", "Library", "Conference Room", "Gym", "Lounge", 
    "Office", "Lab", "Study Room", "Dining Hall"
  ];

  // 페르소나용 일일 스케줄 생성 함수
  const generateDailySchedule = (persona, facilities) => {
    // 시설 색상 매핑
    const facilityColors = {
      "Cafe": "bg-amber-400",
      "Library": "bg-blue-500",
      "Conference Room": "bg-green-500",
      "Gym": "bg-red-500",
      "Lounge": "bg-purple-500",
      "Office": "bg-gray-600",
      "Lab": "bg-indigo-500",
      "Study Room": "bg-teal-500",
      "Dining Hall": "bg-orange-500"
    };
    
    // 시간대 설정 - 더 넓은 시간대로 조정
    const timeSlots = [
      "8:00-9:00",
      "9:00-12:00", 
      "12:00-13:00",
      "13:00-17:00",
      "17:00-18:00"
    ];
    
    const schedule = [];
    const personality = persona.personality;
    
    // 페르소나 유형에 따른 주요 시설 및 활동 패턴
    let primaryFacility, secondaryFacility, activityPattern;
    
    switch (persona.persona_type) {
      case "student":
        primaryFacility = "Library";
        secondaryFacility = "Study Room";
        activityPattern = "study-focused";
        break;
      case "professional":
        primaryFacility = "Office";
        secondaryFacility = "Conference Room";
        activityPattern = "work-focused";
        break;
      case "researcher":
        primaryFacility = "Lab";
        secondaryFacility = "Library";
        activityPattern = "research-focused";
        break;
      case "visitor":
        primaryFacility = "Cafe";
        secondaryFacility = "Lounge";
        activityPattern = "social-focused";
        break;
      case "staff":
        primaryFacility = "Office";
        secondaryFacility = "Conference Room";
        activityPattern = "management-focused";
        break;
      default:
        primaryFacility = "Cafe";
        secondaryFacility = "Lounge";
        activityPattern = "general";
    }
    
    // 스케줄 생성
    timeSlots.forEach((timeSlot, idx) => {
      let location, reasoning;
      const locationColor = facilityColors[location] || "bg-gray-200";
      
      switch (idx) {
        case 0: // 8:00-9:00 - 하루 시작
          if (persona.persona_type === "staff") {
            location = primaryFacility;
            reasoning = `As a ${persona.details.english_name}, ${persona.details.english_name} starts the day early in the ${location.toLowerCase()} to review overnight reports and plan daily operations.`;
          } else if (persona.persona_type === "researcher") {
            location = secondaryFacility;
            reasoning = `${persona.details.english_name} prefers quiet morning hours in ${location.toLowerCase()} for deep reading and literature review when concentration is highest.`;
          } else {
            location = primaryFacility;
            reasoning = `${persona.details.english_name} begins the day in ${location.toLowerCase()} to start daily activities with a ${personality.split(',')[0].toLowerCase()} approach.`;
          }
          break;
          
        case 1: // 9:00-12:00 - 오전 주요 활동
          if (persona.persona_type === "staff") {
            location = "Cafe";
            reasoning = `${persona.details.english_name} uses the cafe as an informal meeting space to connect with staff and visitors, building relationships while staying accessible.`;
          } else if (persona.persona_type === "researcher") {
            location = primaryFacility;
            reasoning = `Mid-morning ${location.toLowerCase()} time for experimental work when ${persona.details.english_name} is mentally sharp but energy levels allow for hands-on technical tasks.`;
          } else {
            location = primaryFacility;
            reasoning = `Morning focus time in ${location.toLowerCase()} allows ${persona.details.english_name} to tackle demanding tasks with ${personality.includes('Analytical') ? 'analytical precision' : 'full concentration'}.`;
          }
          break;
          
        case 2: // 12:00-13:00 - 점심시간
          location = "Cafe";
          if (personality.includes("Social")) {
            reasoning = `Social lunch break in cafe provides ${persona.details.english_name} with necessary social interaction to balance their work.`;
          } else {
            reasoning = `Lunch break in the cafe allows ${persona.details.english_name} to recharge and observe facility usage patterns.`;
          }
          break;
          
        case 3: // 13:00-17:00 - 오후 주요 활동
          if (persona.persona_type === "staff") {
            location = secondaryFacility;
            reasoning = `Afternoon meetings in ${location.toLowerCase()} for strategic planning and departmental coordination - formal business requires dedicated space.`;
          } else if (persona.persona_type === "researcher") {
            location = secondaryFacility;
            reasoning = `Afternoon return to ${location.toLowerCase()} for writing and analysis - post-lunch period suits ${persona.details.english_name}'s preference for reflective, analytical work.`;
          } else {
            location = primaryFacility;
            reasoning = `Afternoon session in ${location.toLowerCase()} for ${persona.persona_type === 'student' ? 'focused study' : 'productive work'} when energy levels stabilize after lunch.`;
          }
          break;
          
        case 4: // 17:00-18:00 - 하루 마무리
          if (persona.persona_type === "researcher") {
            location = primaryFacility;
            reasoning = `Evening ${location.toLowerCase()} session for running long experiments that can continue overnight - ${persona.details.english_name} optimizes schedule around computational resources.`;
          } else if (persona.persona_type === "staff") {
            location = primaryFacility;
            reasoning = `End-of-day wrap-up in ${location.toLowerCase()} to complete administrative tasks and prepare for next day before building closes.`;
          } else {
            location = primaryFacility;
            reasoning = `Final session in ${location.toLowerCase()} to wrap up daily tasks and prepare for tomorrow with ${personality.split(',')[0].toLowerCase()} attention to detail.`;
          }
          break;
      }
      
      schedule.push({
        time_slot: timeSlot,
        location: location,
        location_color: facilityColors[location] || "bg-gray-200",
        llm_reasoning: reasoning
      });
    });
    
    return schedule;
  };

  // LLM을 사용한 실제 페르소나 생성 함수
  // 여기서는 실제 API 호출은 생략하고 형식만 맞춘 예시 데이터를 생성합니다
  const generatePersonas = () => {
    setLoading(true);
    
    // 실제 구현에서는 여기서 LLM API 호출이 이루어집니다
    // const response = await fetch('/api/generate-personas', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     llmSettings,
    //     filter,
    //     facilities: availableFacilities
    //   })
    // });
    // const data = await response.json();
    // setPersonas(data.personas);
    
    // 데모 목적으로 시간 지연 후 샘플 데이터 생성
    setTimeout(() => {
      const newPersonas = [];
      const count = filter.count;
      const facilitiesToUse = availableFacilities.length > 0 ? 
                              availableFacilities : defaultFacilities;
      
      // 페르소나 유형 옵션
      const personaTypes = ["student", "professional", "researcher", "visitor", "staff"];
      
      // 샘플 이름
      const maleFirstNames = ["James", "William", "Mason", "Ethan", "Michael", "Aiden", "Liam", "Noah"];
      const femaleFirstNames = ["Emma", "Olivia", "Ava", "Isabella", "Sophia", "Mia", "Charlotte", "Amelia"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
      
      for (let i = 1; i <= count; i++) {
        const gender = filter.gender === "Any" 
          ? Math.random() > 0.5 ? "Male" : "Female"
          : filter.gender;
          
        const ageGroup = filter.ageGroup === "Any"
          ? ageGroupOptions[Math.floor(Math.random() * (ageGroupOptions.length - 1)) + 1]
          : filter.ageGroup;
        
        const personaType = filter.personaType === "Any"
          ? personaTypes[Math.floor(Math.random() * personaTypes.length)]
          : filter.personaType;
        
        // 이름 생성
        const firstName = gender === "Male" 
          ? maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)]
          : femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName}`;
        
        // 나이 생성
        const age = ageGroup === "Under 10" ? Math.floor(Math.random() * 10) + 5 :
                   ageGroup === "10s" ? Math.floor(Math.random() * 10) + 10 :
                   ageGroup === "20s" ? Math.floor(Math.random() * 10) + 20 :
                   ageGroup === "30s" ? Math.floor(Math.random() * 10) + 30 :
                   ageGroup === "40s" ? Math.floor(Math.random() * 10) + 40 :
                   Math.floor(Math.random() * 15) + 50;
        
        // 페르소나 유형에 따른 이모지 및 역할 생성
        let emoji, role;
        switch (personaType) {
          case "student":
            emoji = gender === "Male" ? "🧑" : "👩‍🎓";
            role = ["Undergraduate Student", "Graduate Student", "PhD Candidate"][Math.floor(Math.random() * 3)];
            break;
          case "professional":
            emoji = gender === "Male" ? "👔" : "👩‍💼";
            role = ["Software Developer", "Accountant", "Marketing Manager", "Product Manager"][Math.floor(Math.random() * 4)];
            break;
          case "researcher":
            emoji = gender === "Male" ? "🧪" : "👩‍🔬";
            role = ["Research Scientist", "Senior Researcher", "Lab Director", "Data Analyst"][Math.floor(Math.random() * 4)];
            break;
          case "visitor":
            emoji = gender === "Male" ? "🧳" : "👜";
            role = ["Client", "Guest Speaker", "Workshop Attendee", "External Consultant"][Math.floor(Math.random() * 4)];
            break;
          case "staff":
            emoji = gender === "Male" ? "🛠" : "👷‍♀️";
            role = ["Building Manager", "IT Support", "Administrative Assistant", "Facility Manager"][Math.floor(Math.random() * 4)];
            break;
          default:
            emoji = gender === "Male" ? "👨" : "👩";
            role = "Visitor";
        }
        
        // 성격 유형 생성
        const personalityTypes = [
          "Analytical, detail-oriented, methodical",
          "Creative, innovative, big-picture thinker",
          "Social, outgoing, relationship-focused",
          "Organized, structured, process-driven",
          "Reserved, reflective, thoughtful"
        ];
        const personality = personalityTypes[Math.floor(Math.random() * personalityTypes.length)];
        
        // 활동 시간대
        const activeHours = ["Morning", "Afternoon", "Evening"][Math.floor(Math.random() * 3)];
        
        // 시설 선호도 (2-3개)
        const facilitiesCount = Math.floor(Math.random() * 2) + 2;
        const shuffledFacilities = [...facilitiesToUse].sort(() => 0.5 - Math.random());
        const preferredFacilities = shuffledFacilities.slice(0, facilitiesCount);
        
        // 프로필 설명 생성
        const descriptions = [
          `A ${personality.toLowerCase()} ${role.toLowerCase()} who prefers working during ${activeHours.toLowerCase()} hours.`,
          `${fullName} is a ${age}-year-old ${gender.toLowerCase()} who works as a ${role.toLowerCase()}. They are ${personality.toLowerCase()}.`,
          `As a ${role}, ${firstName} brings a ${personality.split(',')[0].toLowerCase()} approach to their work.`,
          `${firstName} is known for being ${personality.toLowerCase()} in their role as a ${role.toLowerCase()}.`
        ];
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        // 페르소나 객체 생성
        const newPersona = {
          id: i,
          name: firstName,
          emoji: emoji,
          persona_type: personaType,
          details: {
            english_name: firstName,
            role: role,
            age: age,
            description: description,
            personality: personality
          },
          daily_schedule: generateDailySchedule(
            {
              name: firstName,
              active_hours: activeHours,
              personality: personality,
              persona_type: personaType,
              details: {
                english_name: firstName
              }
            }, 
            facilitiesToUse
          )
        };
        
        newPersonas.push(newPersona);
      }
      
      setPersonas(newPersonas);
      setLoading(false);
    }, 1500);
  };
  
  // 선택한 페르소나 시뮬레이션용 저장
  const proceedToSimulation = () => {
    if (selectedPersonas.length === 0) {
      alert("Please select at least one persona for simulation.");
      return;
    }
    
    // JSON 데이터 생성
    const jsonData = {
      personas: selectedPersonas
    };
    
    // localStorage에 저장
    localStorage.setItem('simulationPersonas', JSON.stringify(jsonData));
    
    // 저장된 데이터 확인
    console.log('Saved personas data:', jsonData);
    
    // 다운로드 옵션 제공
    if (window.confirm(`${selectedPersonas.length} personas saved! Do you want to download the JSON file?`)) {
      downloadPersonasJson(jsonData);
    }
    
    // 시뮬레이션으로 이동
    navigate('/simulation');
  };
  
  // 페르소나 JSON 파일 다운로드 함수
  const downloadPersonasJson = (jsonData) => {
    // JSON 데이터를 문자열로 변환
    const jsonString = JSON.stringify(jsonData, null, 2);
    
    // Blob 생성
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // 다운로드 링크 생성
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'personas.json';
    
    // 링크 클릭하여 다운로드 시작
    document.body.appendChild(a);
    a.click();
    
    // 정리
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    alert("personas.json file has been downloaded.");
  };
  
  // 페르소나 선택 토글
  const togglePersonaSelection = (persona) => {
    if (selectedPersonas.some(p => p.id === persona.id)) {
      setSelectedPersonas(selectedPersonas.filter(p => p.id !== persona.id));
    } else {
      setSelectedPersonas([...selectedPersonas, persona]);
    }
  };

  return (
    <div className="w-full bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">PlaceSim</h1>
              <div className="ml-8">
                <StageTabs activeStage="Personas" />
              </div>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              LLM Settings
            </button>
          </div>
        </div>
      </nav>

      {/* LLM Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">LLM API Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LLM Provider
                </label>
                <select
                  value={llmSettings.provider}
                  onChange={(e) => setLlmSettings({
                    ...llmSettings, 
                    provider: e.target.value,
                    model: getModelOptions(e.target.value)[0]?.value || ""
                  })}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                >
                  {llmProviderOptions.map(provider => (
                    <option key={provider.value} value={provider.value}>
                      {provider.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <select
                  value={llmSettings.model}
                  onChange={(e) => setLlmSettings({...llmSettings, model: e.target.value})}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                >
                  {getModelOptions(llmSettings.provider).map(model => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Select the appropriate model for your persona generation task.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={apiKeyHidden ? "password" : "text"}
                    value={llmSettings.apiKey}
                    onChange={(e) => setLlmSettings({...llmSettings, apiKey: e.target.value})}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10"
                    placeholder="Enter your API key"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                    onClick={() => setApiKeyHidden(!apiKeyHidden)}
                  >
                    {apiKeyHidden ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Your API key is stored locally in your browser and never sent to our servers.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={llmSettings.temperature}
                    onChange={(e) => setLlmSettings({...llmSettings, temperature: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (Deterministic)</span>
                    <span>{llmSettings.temperature}</span>
                    <span>2 (Creative)</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="8000"
                    step="100"
                    value={llmSettings.maxTokens}
                    onChange={(e) => setLlmSettings({...llmSettings, maxTokens: parseInt(e.target.value) || 1000})}
                    className="w-full border border-gray-300 rounded-md py-2 px-3"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum output length for generated content.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Settings</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Provider: <span className="font-medium">{
                    llmProviderOptions.find(p => p.value === llmSettings.provider)?.label || llmSettings.provider
                  }</span></div>
                  <div>Model: <span className="font-medium">{
                    getModelOptions(llmSettings.provider).find(m => m.value === llmSettings.model)?.label || llmSettings.model
                  }</span></div>
                  <div>Temperature: <span className="font-medium">{llmSettings.temperature}</span></div>
                  <div>Max Tokens: <span className="font-medium">{llmSettings.maxTokens}</span></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveLlmSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Create Community Facility User Personas
        </h2>

        {/* LLM Status Banner */}
        <div className={`mb-6 rounded-lg p-4 ${llmSettings.apiKey ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 mt-0.5 ${llmSettings.apiKey ? "text-green-500" : "text-yellow-500"}`}>
              {llmSettings.apiKey ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${llmSettings.apiKey ? "text-green-800" : "text-yellow-800"}`}>
                {llmSettings.apiKey ? "LLM API Ready" : "LLM API Key Required"}
              </h3>
              <div className="mt-1 text-sm">
                <p className={llmSettings.apiKey ? "text-green-700" : "text-yellow-700"}>
                  {llmSettings.apiKey 
                    ? `Using ${getModelOptions(llmSettings.provider).find(m => m.value === llmSettings.model)?.label || llmSettings.model} from ${llmProviderOptions.find(p => p.value === llmSettings.provider)?.label || llmSettings.provider}.` 
                    : "Please configure your LLM API settings before generating personas with AI."}
                </p>
              </div>
              {!llmSettings.apiKey && (
                <div className="mt-2">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-sm font-medium text-yellow-800 hover:text-yellow-700 underline"
                  >
                    Configure LLM Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Facility Alert */}
        {availableFacilities.length === 0 && (
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Persona Type</label>
              <select
                value={filter.personaType}
                onChange={(e) => setFilter({...filter, personaType: e.target.value})}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                {personaTypeOptions.map(option => (
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
                  <span className="mr-1">{persona.emoji}</span> {persona.name || persona.details?.english_name}
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
                onClick={proceedToSimulation}
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
              <p className="mt-4 text-gray-500">Generating personas with {llmSettings.provider} {llmSettings.model}...</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 h-12 flex items-center justify-between px-8 text-sm text-[#666666]">
        <div>Persona Generation Dashboard v1.0</div>
        <div className="flex items-center">
          <span className="mr-3">{llmSettings.apiKey ? `Using ${llmSettings.provider.toUpperCase()} API` : "LLM API Not Configured"}</span>
          <button 
            onClick={() => setShowSettings(true)} 
            className="text-blue-600 hover:text-blue-800 text-xs underline"
          >
            Change Settings
          </button>
        </div>
      </footer>
    </div>
  );
}