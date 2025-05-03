import React from "react";
import { useNavigate } from "react-router-dom";

// Simple Button component for the landing page
const Button = ({ children, className = "", onClick }) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#212121] mb-4">
            LLM Behavior Simulator
          </h1>
          <p className="text-xl text-[#424242] max-w-3xl mx-auto mb-8">
            Create AI Personas. Design Spaces. Simulate Movements.
          </p>
          <Button
            className="bg-black text-white px-8 py-4 text-lg font-bold rounded-lg shadow-lg hover:bg-gray-800 transition-all"
            onClick={() => navigate("/facilities")}
          >
            Start Simulation
          </Button>
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

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Simulation?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Explore how AI personas interact with spaces and each other in a dynamic environment.
          </p>
          <Button
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-lg shadow-lg transition-all"
            onClick={() => navigate("/facilities")}
          >
            Launch Simulator
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-[#666666]">LLM Facilities Simulation v1.0</div>
          <div className="text-sm text-[#666666]">Made by Suhyeon Lee</div>
        </div>
      </footer>
    </div>
  );
}