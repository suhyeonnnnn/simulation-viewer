import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const WhatIfScenarioPage = () => {
  // Helper functions - defined first
  const getDefaultFacilities = () => [
    { name: 'Cafe', capacity: 20, openingHours: '08:00', closingHours: '22:00' },
    { name: 'Library', capacity: 40, openingHours: '08:00', closingHours: '22:00' },
    { name: 'Gym', capacity: 15, openingHours: '08:00', closingHours: '22:00' },
    { name: 'Conference Room', capacity: 12, openingHours: '08:00', closingHours: '20:00' }
  ];

  const getDefaultPersonas = () => [
    { id: 'persona_1', name: 'Student', preferred_facilities: ['Library', 'Cafe'] },
    { id: 'persona_2', name: 'Professional', preferred_facilities: ['Conference Room', 'Cafe'] },
    { id: 'persona_3', name: 'Researcher', preferred_facilities: ['Library', 'Conference Room'] }
  ];

  // State variables
  const [activeScenario, setActiveScenario] = useState('capacity');
  const [scenarioParams, setScenarioParams] = useState({
    capacity: {
      facilityName: 'Cafe',
      changePercent: 50
    },
    closure: {
      facilityName: 'Library',
      closureDay: 'Saturday',
      duration: 'Full Day'
    },
    hours: {
      facilityName: 'Gym',
      newOpen: '06:00',
      newClose: '24:00'
    },
    newFacility: {
      name: 'Study Pod',
      capacity: 15,
      location: 'Floor 2'
    }
  });
  const [baselineData, setBaselineData] = useState(null);
  const [simulationResults, setSimulationResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [personas, setPersonas] = useState([]);

  // Load data functions
  const loadRealData = () => {
    // Load facilities
    const storedFacilities = localStorage.getItem('simulationFacilities');
    if (storedFacilities) {
      try {
        const facilitiesData = JSON.parse(storedFacilities);
        if (Array.isArray(facilitiesData) && facilitiesData.length > 0) {
          setFacilities(facilitiesData);
        } else {
          setFacilities(getDefaultFacilities());
        }
      } catch (e) {
        console.error("Error parsing facilities:", e);
        setFacilities(getDefaultFacilities());
      }
    } else {
      setFacilities(getDefaultFacilities());
    }

    // Load personas
    const storedPersonas = localStorage.getItem('simulationPersonas');
    if (storedPersonas) {
      try {
        const personasData = JSON.parse(storedPersonas);
        if (Array.isArray(personasData) && personasData.length > 0) {
          setPersonas(personasData);
        } else {
          setPersonas(getDefaultPersonas());
        }
      } catch (e) {
        console.error("Error parsing personas:", e);
        setPersonas(getDefaultPersonas());
      }
    } else {
      setPersonas(getDefaultPersonas());
    }

    // Generate baseline simulation data
    generateBaselineData();
  };

  const generateBaselineData = () => {
    // Simulate current facility usage based on real data
    const baseline = {
      dailyVisitors: {
        'Cafe': { peak: 18, average: 12, satisfaction: 85 },
        'Library': { peak: 35, average: 25, satisfaction: 78 },
        'Gym': { peak: 12, average: 8, satisfaction: 72 },
        'Conference Room': { peak: 10, average: 6, satisfaction: 90 }
      },
      hourlyUsage: [
        { time: '08:00', Cafe: 8, Library: 15, Gym: 5, 'Conference Room': 2 },
        { time: '10:00', Cafe: 12, Library: 25, Gym: 8, 'Conference Room': 6 },
        { time: '12:00', Cafe: 18, Library: 30, Gym: 6, 'Conference Room': 8 },
        { time: '14:00', Cafe: 15, Library: 35, Gym: 10, 'Conference Room': 10 },
        { time: '16:00', Cafe: 10, Library: 28, Gym: 12, 'Conference Room': 6 },
        { time: '18:00', Cafe: 8, Library: 20, Gym: 8, 'Conference Room': 3 },
        { time: '20:00', Cafe: 5, Library: 15, Gym: 6, 'Conference Room': 1 }
      ],
      personaDistribution: {
        'Student': 45,
        'Professional': 35,
        'Researcher': 20
      },
      overallMetrics: {
        totalDailyVisitors: 150,
        averageWaitTime: 8,
        facilityUtilization: 72,
        userSatisfaction: 81
      }
    };
    setBaselineData(baseline);
  };

  // Effects
  useEffect(() => {
    // Set default data first
    setFacilities(getDefaultFacilities());
    setPersonas(getDefaultPersonas());
    
    // Then load real data
    loadRealData();
  }, []);

  // Update scenario params when facilities change
  useEffect(() => {
    if (Array.isArray(facilities) && facilities.length > 0) {
      setScenarioParams(prev => ({
        capacity: {
          ...prev.capacity,
          facilityName: facilities.find(f => f.name === prev.capacity.facilityName)?.name || facilities[0].name
        },
        closure: {
          ...prev.closure,
          facilityName: facilities.find(f => f.name === prev.closure.facilityName)?.name || facilities[0].name
        },
        hours: {
          ...prev.hours,
          facilityName: facilities.find(f => f.name === prev.hours.facilityName)?.name || facilities[0].name
        },
        newFacility: prev.newFacility
      }));
    }
  }, [facilities]);

  const scenarios = [
    {
      id: 'capacity',
      title: 'Capacity Change',
      icon: '📈',
      description: 'Increase or decrease facility capacity',
      color: 'bg-blue-500'
    },
    {
      id: 'closure',
      title: 'Temporary Closure',
      icon: '🚫',
      description: 'Close a facility temporarily',
      color: 'bg-red-500'
    },
    {
      id: 'hours',
      title: 'Operating Hours',
      icon: '🕐',
      description: 'Extend or reduce operating hours',
      color: 'bg-green-500'
    },
    {
      id: 'newFacility',
      title: 'Add New Facility',
      icon: '🏗️',
      description: 'Add a new facility type',
      color: 'bg-purple-500'
    }
  ];

  const runSimulation = () => {
    if (!baselineData) return;
    
    setIsRunning(true);
    
    setTimeout(() => {
      const results = calculateWhatIfResults();
      setSimulationResults(results);
      setIsRunning(false);
    }, 2000);
  };

  const calculateWhatIfResults = () => {
    if (!baselineData) return null;

    let newData = JSON.parse(JSON.stringify(baselineData)); // Deep copy
    let changes = [];

    switch (activeScenario) {
      case 'capacity':
        const facility = scenarioParams.capacity.facilityName;
        const changePercent = scenarioParams.capacity.changePercent;
        
        // Calculate capacity impact
        const currentCapacity = facilities.find(f => f.name === facility)?.capacity || 20;
        const newCapacity = Math.round(currentCapacity * (1 + changePercent / 100));
        
        // Impact on peak usage
        const oldPeak = newData.dailyVisitors[facility].peak;
        const newPeak = Math.min(newCapacity, Math.round(oldPeak * (1 + changePercent / 150)));
        
        newData.dailyVisitors[facility].peak = newPeak;
        newData.dailyVisitors[facility].average = Math.round(newPeak * 0.7);
        
        // Impact on satisfaction (capacity increase generally improves satisfaction)
        if (changePercent > 0) {
          newData.dailyVisitors[facility].satisfaction = Math.min(95, 
            newData.dailyVisitors[facility].satisfaction + Math.round(changePercent / 5));
        } else {
          newData.dailyVisitors[facility].satisfaction = Math.max(50, 
            newData.dailyVisitors[facility].satisfaction + Math.round(changePercent / 3));
        }
        
        // Update hourly usage
        newData.hourlyUsage = newData.hourlyUsage.map(hour => ({
          ...hour,
          [facility]: Math.min(newCapacity, Math.round(hour[facility] * (1 + changePercent / 150)))
        }));

        changes = [
          { 
            metric: 'Peak Usage', 
            before: oldPeak, 
            after: newPeak, 
            change: newPeak - oldPeak,
            unit: 'people'
          },
          { 
            metric: 'User Satisfaction', 
            before: baselineData.dailyVisitors[facility].satisfaction, 
            after: newData.dailyVisitors[facility].satisfaction,
            change: newData.dailyVisitors[facility].satisfaction - baselineData.dailyVisitors[facility].satisfaction,
            unit: '%'
          },
          { 
            metric: 'Facility Capacity', 
            before: currentCapacity, 
            after: newCapacity,
            change: newCapacity - currentCapacity,
            unit: 'people'
          }
        ];
        break;

      case 'closure':
        const closedFacility = scenarioParams.closure.facilityName;
        const displacedUsers = newData.dailyVisitors[closedFacility].average;
        
        // Set closed facility to 0
        newData.dailyVisitors[closedFacility] = { peak: 0, average: 0, satisfaction: 0 };
        
        // Redistribute users to other facilities
        const otherFacilities = Object.keys(newData.dailyVisitors).filter(f => f !== closedFacility);
        otherFacilities.forEach(facility => {
          const additionalUsers = Math.round(displacedUsers / otherFacilities.length);
          newData.dailyVisitors[facility].average += additionalUsers;
          newData.dailyVisitors[facility].peak += Math.round(additionalUsers * 1.3);
          
          // Decrease satisfaction due to overcrowding
          newData.dailyVisitors[facility].satisfaction = Math.max(40, 
            newData.dailyVisitors[facility].satisfaction - 15);
        });

        // Update hourly usage
        newData.hourlyUsage = newData.hourlyUsage.map(hour => {
          const updated = { ...hour };
          updated[closedFacility] = 0;
          
          otherFacilities.forEach(facility => {
            updated[facility] = Math.round(updated[facility] * 1.4);
          });
          
          return updated;
        });

        changes = [
          { 
            metric: 'Displaced Users', 
            before: 0, 
            after: displacedUsers,
            change: displacedUsers,
            unit: 'people'
          },
          { 
            metric: 'Overall Satisfaction', 
            before: baselineData.overallMetrics.userSatisfaction, 
            after: Math.round(Object.values(newData.dailyVisitors).reduce((sum, f) => sum + f.satisfaction, 0) / Object.keys(newData.dailyVisitors).length),
            change: -12,
            unit: '%'
          }
        ];
        break;

      case 'hours':
        const extendedFacility = scenarioParams.hours.facilityName;
        
        // Extended hours add early morning and late night users
        const earlyUsers = 8;
        const lateUsers = 12;
        
        newData.dailyVisitors[extendedFacility].average += earlyUsers + lateUsers;
        newData.dailyVisitors[extendedFacility].peak += Math.round((earlyUsers + lateUsers) * 0.6);
        newData.dailyVisitors[extendedFacility].satisfaction += 8;

        // Add new time slots
        newData.hourlyUsage.unshift({ time: '06:00', [extendedFacility]: earlyUsers, ...Object.fromEntries(Object.keys(newData.dailyVisitors).filter(f => f !== extendedFacility).map(f => [f, 0])) });
        newData.hourlyUsage.push({ time: '22:00', [extendedFacility]: lateUsers, ...Object.fromEntries(Object.keys(newData.dailyVisitors).filter(f => f !== extendedFacility).map(f => [f, 0])) });

        changes = [
          { 
            metric: 'Daily Users', 
            before: baselineData.dailyVisitors[extendedFacility].average, 
            after: newData.dailyVisitors[extendedFacility].average,
            change: earlyUsers + lateUsers,
            unit: 'people'
          },
          { 
            metric: 'Operating Hours', 
            before: 14, 
            after: 18,
            change: 4,
            unit: 'hours'
          },
          { 
            metric: 'User Convenience', 
            before: baselineData.dailyVisitors[extendedFacility].satisfaction, 
            after: newData.dailyVisitors[extendedFacility].satisfaction,
            change: 8,
            unit: '%'
          }
        ];
        break;

      case 'newFacility':
        const newFacilityName = scenarioParams.newFacility.name;
        const newFacilityCapacity = scenarioParams.newFacility.capacity;
        
        // New facility attracts users from existing facilities
        newData.dailyVisitors[newFacilityName] = {
          peak: Math.round(newFacilityCapacity * 0.8),
          average: Math.round(newFacilityCapacity * 0.6),
          satisfaction: 88
        };

        // Add to hourly usage
        newData.hourlyUsage = newData.hourlyUsage.map(hour => ({
          ...hour,
          [newFacilityName]: Math.round(Math.random() * 10) + 2
        }));

        changes = [
          { 
            metric: 'New Daily Users', 
            before: 0, 
            after: newData.dailyVisitors[newFacilityName].average,
            change: newData.dailyVisitors[newFacilityName].average,
            unit: 'people'
          },
          { 
            metric: 'Total Facility Count', 
            before: Object.keys(baselineData.dailyVisitors).length, 
            after: Object.keys(newData.dailyVisitors).length,
            change: 1,
            unit: 'facilities'
          }
        ];
        break;
    }

    return {
      scenario: scenarios.find(s => s.id === activeScenario).title,
      baseline: baselineData,
      newData: newData,
      changes: changes,
      summary: generateSummary(changes),
      recommendation: generateRecommendation(changes)
    };
  };

  const generateSummary = (changes) => {
    const positiveChanges = changes.filter(c => c.change > 0).length;
    const negativeChanges = changes.filter(c => c.change < 0).length;
    
    if (positiveChanges > negativeChanges) {
      return "Overall positive impact expected";
    } else if (negativeChanges > positiveChanges) {
      return "Mixed results with some negative impacts";
    } else {
      return "Neutral impact with trade-offs";
    }
  };

  const generateRecommendation = (changes) => {
    const majorChanges = changes.filter(c => Math.abs(c.change) > 10);
    
    if (majorChanges.length > 0 && majorChanges.every(c => c.change > 0)) {
      return "Highly recommended for implementation";
    } else if (majorChanges.some(c => c.change < -15)) {
      return "Requires careful consideration due to significant negative impacts";
    } else {
      return "Moderate impact - consider testing with smaller scale first";
    }
  };

  const updateScenarioParam = (category, key, value) => {
    setScenarioParams(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const renderScenarioControls = () => {
    // Safety check for facilities array
    if (!Array.isArray(facilities) || facilities.length === 0) {
      return (
        <div className="text-center py-4">
          <div className="text-gray-500 mb-2">Loading facilities...</div>
          <div className="text-sm text-gray-400">Please wait while we load your facility data.</div>
        </div>
      );
    }

    switch (activeScenario) {
      case 'capacity':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Facility</label>
              <select
                value={scenarioParams.capacity.facilityName}
                onChange={(e) => updateScenarioParam('capacity', 'facilityName', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {facilities.map(facility => (
                  <option key={facility.name} value={facility.name}>{facility.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity Change: {scenarioParams.capacity.changePercent > 0 ? '+' : ''}{scenarioParams.capacity.changePercent}%
              </label>
              <input
                type="range"
                min="-50"
                max="100"
                value={scenarioParams.capacity.changePercent}
                onChange={(e) => updateScenarioParam('capacity', 'changePercent', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>-50%</span>
                <span>0%</span>
                <span>+100%</span>
              </div>
            </div>
          </div>
        );

      case 'closure':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facility to Close</label>
              <select
                value={scenarioParams.closure.facilityName}
                onChange={(e) => updateScenarioParam('closure', 'facilityName', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {facilities.map(facility => (
                  <option key={facility.name} value={facility.name}>{facility.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <select
                  value={scenarioParams.closure.closureDay}
                  onChange={(e) => updateScenarioParam('closure', 'closureDay', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  value={scenarioParams.closure.duration}
                  onChange={(e) => updateScenarioParam('closure', 'duration', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="Full Day">Full Day</option>
                  <option value="Morning">Morning Only</option>
                  <option value="Afternoon">Afternoon Only</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'hours':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Facility</label>
              <select
                value={scenarioParams.hours.facilityName}
                onChange={(e) => updateScenarioParam('hours', 'facilityName', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {facilities.map(facility => (
                  <option key={facility.name} value={facility.name}>{facility.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Opening Time</label>
                <input
                  type="time"
                  value={scenarioParams.hours.newOpen}
                  onChange={(e) => updateScenarioParam('hours', 'newOpen', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Closing Time</label>
                <input
                  type="time"
                  value={scenarioParams.hours.newClose}
                  onChange={(e) => updateScenarioParam('hours', 'newClose', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        );

      case 'newFacility':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facility Name</label>
              <input
                type="text"
                value={scenarioParams.newFacility.name}
                onChange={(e) => updateScenarioParam('newFacility', 'name', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., Study Pod, Gaming Room"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={scenarioParams.newFacility.capacity}
                  onChange={(e) => updateScenarioParam('newFacility', 'capacity', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={scenarioParams.newFacility.location}
                  onChange={(e) => updateScenarioParam('newFacility', 'location', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Floor 2, Building A"
                />
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a scenario to configure parameters.</div>;
    }
  };

  const ComparisonMetricCard = ({ change }) => {
    const isPositive = change.change > 0;
    const isNeutral = change.change === 0;
    
    return (
      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-medium text-gray-700 mb-3">{change.metric}</h4>
        
        <div className="flex items-center justify-between mb-2">
          <div className="text-center">
            <div className="text-sm text-gray-500">Before</div>
            <div className="text-lg font-semibold">{change.before}{change.unit === '%' ? '%' : ''}</div>
          </div>
          
          <div className="mx-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              isNeutral ? 'bg-gray-100' : isPositive ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isNeutral ? (
                <span className="text-gray-500">→</span>
              ) : isPositive ? (
                <span className="text-green-600">↑</span>
              ) : (
                <span className="text-red-600">↓</span>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-500">After</div>
            <div className="text-lg font-semibold">{change.after}{change.unit === '%' ? '%' : ''}</div>
          </div>
        </div>
        
        <div className="text-center">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
            isNeutral ? 'bg-gray-100 text-gray-600' :
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isPositive && '+'}{change.change} {change.unit}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16">
            <button className="px-3 py-1 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
              What If Analysis
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            What If Scenario Analysis
          </h2>
          <p className="text-gray-600">
            Compare how changes would affect your current facility usage patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Scenario Selection */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Select Scenario</h3>
              <div className="space-y-3">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setActiveScenario(scenario.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      activeScenario === scenario.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <span className="text-xl mr-2">{scenario.icon}</span>
                      <span className="font-medium text-sm">{scenario.title}</span>
                    </div>
                    <p className="text-xs text-gray-600">{scenario.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Scenario Configuration */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Configure</h3>
              {renderScenarioControls()}
              
              <button
                onClick={runSimulation}
                disabled={isRunning || !baselineData}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium disabled:opacity-50"
              >
                {isRunning ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Calculating...
                  </div>
                ) : (
                  'Run Analysis'
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Comparison Results */}
          <div className="lg:col-span-3">
            {simulationResults ? (
              <div className="space-y-6">
                {/* Quick Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Impact Summary</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      simulationResults.summary.includes('positive') ? 'bg-green-100 text-green-800' :
                      simulationResults.summary.includes('negative') ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {simulationResults.summary}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {simulationResults.changes.map((change, index) => (
                      <ComparisonMetricCard key={index} change={change} />
                    ))}
                  </div>
                </div>

                {/* Before vs After Visualization */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Before vs After Comparison</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Facility Usage Chart */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Daily Facility Usage</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            ...Object.entries(simulationResults.baseline.dailyVisitors).map(([name, data]) => ({
                              facility: name,
                              before: data.average,
                              after: simulationResults.newData.dailyVisitors[name]?.average || 0,
                              type: 'Current vs New'
                            }))
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="facility" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="before" fill="#94a3b8" name="Current" />
                            <Bar dataKey="after" fill="#3b82f6" name="After Change" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Hourly Usage Chart */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Hourly Usage Pattern</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={simulationResults.baseline.hourlyUsage.map((hour, index) => ({
                            time: hour.time,
                            beforeTotal: Object.values(hour).reduce((sum, val) => typeof val === 'number' ? sum + val : sum, 0),
                            afterTotal: simulationResults.newData.hourlyUsage[index] ? 
                              Object.values(simulationResults.newData.hourlyUsage[index]).reduce((sum, val) => typeof val === 'number' ? sum + val : sum, 0) : 0
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="beforeTotal" stroke="#94a3b8" strokeWidth={2} name="Current" />
                            <Line type="monotone" dataKey="afterTotal" stroke="#3b82f6" strokeWidth={2} name="After Change" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Impact Analysis */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Detailed Impact Analysis</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Facility-wise Changes */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Facility-wise Impact</h4>
                      <div className="space-y-3">
                        {Object.entries(simulationResults.baseline.dailyVisitors).map(([facility, baseData]) => {
                          const newData = simulationResults.newData.dailyVisitors[facility];
                          if (!newData) return null;
                          
                          const usageChange = newData.average - baseData.average;
                          const satisfactionChange = newData.satisfaction - baseData.satisfaction;
                          
                          return (
                            <div key={facility} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{facility}</span>
                                <span className={`text-sm px-2 py-1 rounded ${
                                  usageChange > 0 ? 'bg-green-100 text-green-700' :
                                  usageChange < 0 ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {usageChange > 0 ? '+' : ''}{usageChange} users
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="text-gray-500">Usage</div>
                                  <div className="flex items-center">
                                    <span className="text-gray-600">{baseData.average}</span>
                                    <span className="mx-2">→</span>
                                    <span className="font-medium">{newData.average}</span>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Satisfaction</div>
                                  <div className="flex items-center">
                                    <span className="text-gray-600">{baseData.satisfaction}%</span>
                                    <span className="mx-2">→</span>
                                    <span className={`font-medium ${
                                      satisfactionChange > 0 ? 'text-green-600' :
                                      satisfactionChange < 0 ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                      {newData.satisfaction}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Key Insights */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Key Insights</h4>
                      <div className="space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="text-blue-500 text-xl mr-3">💡</div>
                            <div>
                              <div className="font-medium text-blue-900 mb-1">Primary Impact</div>
                              <div className="text-blue-700 text-sm">
                                {simulationResults.changes[0] && 
                                  `${simulationResults.changes[0].metric} ${simulationResults.changes[0].change > 0 ? 'increases' : 'decreases'} by ${Math.abs(simulationResults.changes[0].change)} ${simulationResults.changes[0].unit}`
                                }
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="text-yellow-500 text-xl mr-3">⚠️</div>
                            <div>
                              <div className="font-medium text-yellow-900 mb-1">Side Effects</div>
                              <div className="text-yellow-700 text-sm">
                                {activeScenario === 'closure' && 'Users will be displaced to other facilities, potentially causing overcrowding'}
                                {activeScenario === 'capacity' && scenarioParams.capacity.changePercent > 0 && 'Higher capacity may require additional staff and resources'}
                                {activeScenario === 'capacity' && scenarioParams.capacity.changePercent < 0 && 'Reduced capacity may lead to longer wait times and decreased satisfaction'}
                                {activeScenario === 'hours' && 'Extended hours require additional operational costs and staff'}
                                {activeScenario === 'newFacility' && 'New facility may reduce usage of existing similar facilities'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={`border rounded-lg p-4 ${
                          simulationResults.recommendation.includes('Highly recommended') ? 'bg-green-50 border-green-200' :
                          simulationResults.recommendation.includes('careful consideration') ? 'bg-red-50 border-red-200' :
                          'bg-yellow-50 border-yellow-200'
                        }`}>
                          <div className="flex items-start">
                            <div className={`text-xl mr-3 ${
                              simulationResults.recommendation.includes('Highly recommended') ? 'text-green-500' :
                              simulationResults.recommendation.includes('careful consideration') ? 'text-red-500' :
                              'text-yellow-500'
                            }`}>
                              {simulationResults.recommendation.includes('Highly recommended') ? '✅' :
                               simulationResults.recommendation.includes('careful consideration') ? '❌' : '⚖️'}
                            </div>
                            <div>
                              <div className={`font-medium mb-1 ${
                                simulationResults.recommendation.includes('Highly recommended') ? 'text-green-900' :
                                simulationResults.recommendation.includes('careful consideration') ? 'text-red-900' :
                                'text-yellow-900'
                              }`}>
                                Recommendation
                              </div>
                              <div className={`text-sm ${
                                simulationResults.recommendation.includes('Highly recommended') ? 'text-green-700' :
                                simulationResults.recommendation.includes('careful consideration') ? 'text-red-700' :
                                'text-yellow-700'
                              }`}>
                                {simulationResults.recommendation}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Items */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <div className="font-medium">Export Analysis</div>
                        <div className="text-sm text-gray-600">Save results for review</div>
                      </div>
                    </button>
                    
                    <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
                      <div className="text-center">
                        <div className="text-2xl mb-2">✅</div>
                        <div className="font-medium">Implement Change</div>
                        <div className="text-sm text-gray-600">Apply this scenario</div>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setSimulationResults(null)}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">🔄</div>
                        <div className="font-medium">Try Another</div>
                        <div className="text-sm text-gray-600">Test different scenario</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">🔮</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready to Analyze</h3>
                <p className="text-gray-500 mb-6">
                  Select a scenario and configure parameters to see how changes would impact your current facility usage.
                </p>
                {!baselineData && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-700 text-sm">
                      Loading baseline data from your current simulation...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 h-12 flex items-center justify-between px-8 text-sm text-[#666666]">
        <div>What If Analysis v2.0</div>
        <div>Developed by Suhyeon Lee</div>
      </footer>
    </div>
  );
};

export default WhatIfScenarioPage;