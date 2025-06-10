import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Simple Button component for the landing page
const Button = ({ children, className = "", onClick, disabled }) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default function LandingPage() {
  // React Router의 useNavigate 훅 사용
  const navigate = useNavigate();
  
  // LLM 설정 상태
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyHidden, setApiKeyHidden] = useState(true);
  const [llmSettings, setLlmSettings] = useState({
    provider: "openai",
    model: "gpt-4-turbo",
    apiKey: "",
    temperature: 0.7,
    maxTokens: 1000
  });
  
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
  
  // 저장된 설정 불러오기
  useEffect(() => {
    const savedSettings = localStorage.getItem('llmSettings');
    if (savedSettings) {
      try {
        setLlmSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Error parsing LLM settings:", e);
      }
    }
  }, []);
  
  // LLM 설정 저장
  const saveLlmSettings = () => {
    localStorage.setItem('llmSettings', JSON.stringify(llmSettings));
    setShowSettings(false);
    alert("LLM settings saved successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* LLM Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Configure LLM API Settings</h3>
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
                  Select the model for persona generation and simulation.
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
                <h4 className="text-sm font-medium text-gray-700 mb-2">Provider-Specific Settings</h4>
                {llmSettings.provider === "openai" && (
                  <div className="text-xs text-gray-600">
                    <p className="mb-1">
                      For OpenAI, use your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.openai.com/api-keys</a>
                    </p>
                    <p>Format: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                  </div>
                )}
                
                {llmSettings.provider === "anthropic" && (
                  <div className="text-xs text-gray-600">
                    <p className="mb-1">
                      For Anthropic, get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.anthropic.com</a>
                    </p>
                    <p>Format: sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                  </div>
                )}
                
                {llmSettings.provider === "google" && (
                  <div className="text-xs text-gray-600">
                    <p className="mb-1">
                      For Google AI, get your API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ai.google.dev</a>
                    </p>
                  </div>
                )}
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

      {/* Hero Section with LLM Status */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#212121] mb-4">
          PlaceSim: LLM-Powered Human Behavior Simulation
          </h1>
          <p className="text-xl text-[#424242] max-w-3xl mx-auto mb-8">
            Create AI Personas. Design Spaces. Simulate Movements.
          </p>
          
          {/* LLM API Status */}
          <div className={`inline-flex items-center mb-8 px-4 py-2 rounded-full ${llmSettings.apiKey ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
            <span className="w-3 h-3 rounded-full mr-2 animate-pulse" style={{ background: llmSettings.apiKey ? '#22c55e' : '#f59e0b' }}></span>
            <span className="text-sm font-medium">
              {llmSettings.apiKey 
                ? `LLM API Ready: ${llmProviderOptions.find(p => p.value === llmSettings.provider)?.label || llmSettings.provider}`
                : "LLM API Not Configured"}
            </span>
            <button 
              onClick={() => setShowSettings(true)}
              className="ml-2 text-xs underline hover:no-underline"
            >
              {llmSettings.apiKey ? "Change" : "Configure"}
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              className="bg-black text-white px-8 py-4 text-lg font-bold rounded-lg shadow-lg hover:bg-gray-800 transition-all"
              onClick={() => navigate("/facilities")}
            >
              Start Simulation
            </Button>
            
            <Button
              className="bg-white text-gray-800 border border-gray-300 px-8 py-4 text-lg font-bold rounded-lg shadow-lg hover:bg-gray-50 transition-all"
              onClick={() => setShowSettings(true)}
            >
              Configure LLM API
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Overview */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl mb-4">
              1
            </div>
            <h3 className="text-xl font-bold text-[#212121] mb-2">Create Personas</h3>
            <p className="text-[#616161]">
              Design unique AI personas with different roles, behaviors, and daily schedules.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl mb-4">
              2
            </div>
            <h3 className="text-xl font-bold text-[#212121] mb-2">Set Up Facilities</h3>
            <p className="text-[#616161]">
              Create different spaces like cafes, libraries, and conference rooms for your personas to visit.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="bg-amber-400 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl mb-4">
              3
            </div>
            <h3 className="text-xl font-bold text-[#212121] mb-2">Run Simulations</h3>
            <p className="text-[#616161]">
              Watch AI personas move through facilities with adjustable time and speed controls.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Highlights with Simple Visual */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-[#212121] mb-6">
                Interactive Simulation Environment
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="text-green-500 font-bold mr-3">✓</div>
                  <div>
                    <p className="font-semibold text-[#424242]">Real-time movement visualization</p>
                    <p className="text-[#616161]">Track persona locations and facility usage throughout the day</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-green-500 font-bold mr-3">✓</div>
                  <div>
                    <p className="font-semibold text-[#424242]">Customizable schedules</p>
                    <p className="text-[#616161]">Different persona types with unique daily routines</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-green-500 font-bold mr-3">✓</div>
                  <div>
                    <p className="font-semibold text-[#424242]">Detailed persona profiles</p>
                    <p className="text-[#616161]">View information about each AI persona in the simulation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-green-500 font-bold mr-3">✓</div>
                  <div>
                    <p className="font-semibold text-[#424242]">Usage analytics</p>
                    <p className="text-[#616161]">Track facility occupancy and persona distribution</p>
                  </div>
                </div>
              </div>
              <Button
                className="bg-black text-white px-6 py-3 font-bold rounded-lg shadow-md hover:bg-gray-800"
                onClick={() => navigate("/simulation")}
              >
                Explore Simulator
              </Button>
            </div>
            
            <div className="w-full md:w-1/2 bg-gray-100 p-6 rounded-lg shadow-inner">
              {/* Simple mockup of the simulator interface */}
              <div className="mb-4 p-3 bg-white rounded shadow-sm">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>8:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                </div>
                <div className="space-y-3">
                  {/* Timeline rows */}
                  <div className="flex items-center">
                    <div className="w-24 text-sm font-medium">👨 Professional</div>
                    <div className="flex-1 flex h-6 rounded overflow-hidden">
                      <div className="bg-amber-400 flex-1"></div>
                      <div className="bg-green-500 flex-1"></div>
                      <div className="bg-amber-400 flex-1"></div>
                      <div className="bg-red-500 flex-1"></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-sm font-medium">👩 Researcher</div>
                    <div className="flex-1 flex h-6 rounded overflow-hidden">
                      <div className="bg-blue-500 flex-1"></div>
                      <div className="bg-green-500 flex-1"></div>
                      <div className="bg-amber-400 flex-1"></div>
                      <div className="bg-blue-500 flex-1"></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 text-sm font-medium">🧑 Student</div>
                    <div className="flex-1 flex h-6 rounded overflow-hidden">
                      <div className="bg-blue-500 flex-1"></div>
                      <div className="bg-amber-400 flex-1"></div>
                      <div className="bg-blue-500 flex-1"></div>
                      <div className="bg-purple-500 flex-1"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Facility cards mockup */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="bg-amber-400 text-white py-1 px-2 rounded text-sm font-medium mb-2">Cafe</div>
                  <div className="flex justify-between text-sm">
                    <span>Current Users:</span>
                    <span className="font-bold">5</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="bg-blue-500 text-white py-1 px-2 rounded text-sm font-medium mb-2">Library</div>
                  <div className="flex justify-between text-sm">
                    <span>Current Users:</span>
                    <span className="font-bold">3</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="bg-green-500 text-white py-1 px-2 rounded text-sm font-medium mb-2">Conference</div>
                  <div className="flex justify-between text-sm">
                    <span>Current Users:</span>
                    <span className="font-bold">7</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="bg-red-500 text-white py-1 px-2 rounded text-sm font-medium mb-2">Gym</div>
                  <div className="flex justify-between text-sm">
                    <span>Current Users:</span>
                    <span className="font-bold">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-[#212121] mb-12">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
            <h3 className="text-lg font-bold text-[#212121] mb-3">1. Create Personas</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                <div className="bg-amber-400 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl">
                  👱
                </div>
                <div>
                  <div className="font-medium">Jane</div>
                  <div className="text-xs text-gray-500">Building Manager</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                <div className="bg-indigo-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl">
                  👨
                </div>
                <div>
                  <div className="font-medium">Edgar</div>
                  <div className="text-xs text-gray-500">Data Scientist</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-[#616161]">
              Define various roles with unique behaviors and schedules.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
            <h3 className="text-lg font-bold text-[#212121] mb-3">2. Design Spaces</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-amber-400 text-white p-2 rounded text-center">
                <div className="text-xl">☕</div>
                <div className="text-xs font-medium">Cafe</div>
              </div>
              <div className="bg-blue-500 text-white p-2 rounded text-center">
                <div className="text-xl">📚</div>
                <div className="text-xs font-medium">Library</div>
              </div>
              <div className="bg-green-500 text-white p-2 rounded text-center">
                <div className="text-xl">🏢</div>
                <div className="text-xs font-medium">Conference</div>
              </div>
              <div className="bg-red-500 text-white p-2 rounded text-center">
                <div className="text-xl">🏋️</div>
                <div className="text-xs font-medium">Gym</div>
              </div>
            </div>
            <p className="text-sm text-[#616161]">
              Set up facilities with different purposes and activities.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-amber-400">
            <h3 className="text-lg font-bold text-[#212121] mb-3">3. Run Simulation</h3>
            <div className="bg-gray-50 p-3 rounded mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>8AM</span>
                <span>2PM</span>
                <span>8PM</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full mb-3">
                <div className="bg-blue-500 h-2 rounded-full w-1/3"></div>
              </div>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <button className="bg-black text-white text-xs px-3 py-1 rounded">Play</button>
                  <button className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded">Pause</button>
                </div>
                <select className="text-xs bg-white border rounded px-2">
                  <option>1X</option>
                  <option>2X</option>
                  <option>4X</option>
                </select>
              </div>
            </div>
            <p className="text-sm text-[#616161]">
              Control simulation speed and watch persona movements in real-time.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
            <h3 className="text-lg font-bold text-[#212121] mb-3">4. Analyze Results</h3>
            <div className="space-y-2 mb-4">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs font-medium text-gray-500">Cafe Usage</div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 h-3 rounded-full mr-2">
                    <div className="bg-amber-400 h-3 rounded-full" style={{width: "75%"}}></div>
                  </div>
                  <span className="text-xs font-medium">75%</span>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs font-medium text-gray-500">Library Usage</div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 h-3 rounded-full mr-2">
                    <div className="bg-blue-500 h-3 rounded-full" style={{width: "40%"}}></div>
                  </div>
                  <span className="text-xs font-medium">40%</span>
                </div>
              </div>
                              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs font-medium text-gray-500">Gym Usage</div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 h-3 rounded-full mr-2">
                    <div className="bg-red-500 h-3 rounded-full" style={{width: "30%"}}></div>
                  </div>
                  <span className="text-xs font-medium">30%</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-[#616161]">
              Track facility usage and persona behavior patterns.
            </p>
          </div>
        </div>
      </div>

      {/* New LLM Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#212121] mb-3">
            Powered by LLM Technology
          </h2>
          <p className="text-xl text-[#424242] max-w-2xl mx-auto">
            Create realistic behavior simulations using advanced language models
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
            <div className="text-purple-500 text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-[#212121] mb-2">
              AI-Generated Personas
            </h3>
            <p className="text-[#616161]">
              Create diverse and realistic personas with unique personalities, preferences, and behaviors using state-of-the-art language models.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
            <div className="text-blue-500 text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-[#212121] mb-2">
              Intelligent Decision Making
            </h3>
            <p className="text-[#616161]">
              Watch as AI personas make realistic decisions about which facilities to visit based on their preferences, time of day, and current needs.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
            <div className="text-green-500 text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-[#212121] mb-2">
              Behavior Analysis
            </h3>
            <p className="text-[#616161]">
              Gain insights into behavior patterns and facility usage through detailed simulations and analytics dashboards.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Simulation?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Explore how AI personas interact with spaces and each other in a dynamic environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-lg shadow-lg transition-all"
              onClick={() => navigate("/facilities")}
            >
              Launch Simulator
            </Button>
            
            {!llmSettings.apiKey && (
              <Button
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-bold rounded-lg shadow-lg transition-all"
                onClick={() => setShowSettings(true)}
              >
                Set Up LLM API First
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-[#666666]">LLM Facilities Simulation v1.0</div>
          <div className="flex items-center">
            <span className="text-sm text-[#666666] mr-3">
              {llmSettings.apiKey ? 
                `Using ${llmProviderOptions.find(p => p.value === llmSettings.provider)?.label || llmSettings.provider} API` : 
                "LLM API Not Configured"}
            </span>
            <button 
              onClick={() => setShowSettings(true)} 
              className="text-blue-600 hover:text-blue-800 text-xs underline"
            >
              {llmSettings.apiKey ? "Change" : "Configure"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}