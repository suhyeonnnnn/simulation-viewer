import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import StageTabs from "../components/StageTabs";

// Facility usage analytics page
const FacilityAnalytics = () => {
  const [selectedView, setSelectedView] = useState('overview');
  
  // Sample data for analytics
  const overallUsageData = [
    { name: 'Cafe', value: 85, color: '#F59E0B' },
    { name: 'Library', value: 72, color: '#3B82F6' },
    { name: 'Gym', value: 45, color: '#EF4444' },
    { name: 'Conference Room', value: 60, color: '#10B981' },
    { name: 'Lounge', value: 55, color: '#8B5CF6' },
    { name: 'Lab', value: 70, color: '#6366F1' },
    { name: 'Office', value: 78, color: '#6B7280' },
    { name: 'Study Room', value: 68, color: '#14B8A6' },
    { name: 'Reception', value: 50, color: '#F59E0B' },
  ];

  const timeUsageData = [
    { time: '8:00', Cafe: 3, Library: 2, Gym: 1, 'Conference Room': 2, Lounge: 1 },
    { time: '10:00', Cafe: 5, Library: 4, Gym: 2, 'Conference Room': 3, Lounge: 2 },
    { time: '12:00', Cafe: 7, Library: 5, Gym: 2, 'Conference Room': 4, Lounge: 3 },
    { time: '14:00', Cafe: 4, Library: 6, Gym: 3, 'Conference Room': 4, Lounge: 4 },
    { time: '16:00', Cafe: 3, Library: 5, Gym: 3, 'Conference Room': 2, Lounge: 4 },
    { time: '18:00', Cafe: 2, Library: 1, Gym: 4, 'Conference Room': 1, Lounge: 3 },
  ];

  const dayUsageData = [
    { day: 'Mon', Cafe: 75, Library: 80, Gym: 40, 'Conference Room': 85, Lounge: 55 },
    { day: 'Tue', Cafe: 85, Library: 75, Gym: 45, 'Conference Room': 80, Lounge: 60 },
    { day: 'Wed', Cafe: 95, Library: 85, Gym: 50, 'Conference Room': 90, Lounge: 65 },
    { day: 'Thu', Cafe: 90, Library: 90, Gym: 55, 'Conference Room': 85, Lounge: 70 },
    { day: 'Fri', Cafe: 85, Library: 70, Gym: 60, 'Conference Room': 75, Lounge: 75 },
    { day: 'Sat', Cafe: 45, Library: 40, Gym: 70, 'Conference Room': 30, Lounge: 50 },
    { day: 'Sun', Cafe: 35, Library: 35, Gym: 65, 'Conference Room': 25, Lounge: 45 },
  ];

  const personaUsageData = [
    { persona: 'Student', Cafe: 25, Library: 35, Gym: 15, 'Conference Room': 10, Lounge: 20 },
    { persona: 'Professional', Cafe: 30, Library: 20, Gym: 20, 'Conference Room': 40, Lounge: 15 },
    { persona: 'Researcher', Cafe: 20, Library: 40, Gym: 10, 'Conference Room': 30, Lounge: 10 },
    { persona: 'Visitor', Cafe: 15, Library: 5, Gym: 5, 'Conference Room': 15, Lounge: 10 },
    { persona: 'Staff', Cafe: 40, Library: 5, Gym: 10, 'Conference Room': 20, Lounge: 10 },
  ];

  const topInsights = [
    {
      title: "Peak Usage Time",
      insight: "Cafe shows highest usage between 12-2 PM",
      recommendation: "Consider expanding lunch service capacity"
    },
    {
      title: "Underutilized Spaces",
      insight: "Gym has lowest usage during morning hours",
      recommendation: "Offer morning fitness programs to increase engagement"
    },
    {
      title: "Conference Room Demand",
      insight: "Mid-week conference room usage exceeds capacity",
      recommendation: "Consider booking system or additional meeting spaces"
    },
    {
      title: "Library Efficiency",
      insight: "Library maintains consistent high usage",
      recommendation: "Exemplar facility for resource allocation"
    }
  ];

  return (
    <div className="w-full bg-gray-50">

      {/* Navigation - Results 내부 탭들 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16">
            {['Overview', 'By Time of Day', 'By Day of Week', 'By Persona Type'].map((view) => (
              <button
                key={view}
                className={`px-3 py-1 text-sm font-medium ${
                  selectedView === view.toLowerCase().replace(/ /g, '') 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setSelectedView(view.toLowerCase().replace(/ /g, ''))}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {selectedView === 'overview' && (
          <>
            {/* Key Insights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topInsights.map((insight, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h3>
                    <p className="text-gray-600 mb-3">{insight.insight}</p>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-blue-700">💡 {insight.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Usage Distribution */}
            <div className="bg-white rounded-lg shadow p-6 mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Facility Usage Distribution</h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overallUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Usage %" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {selectedView === 'bytimeofday' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Facility Usage by Time of Day</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Cafe" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="Library" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Gym" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="Conference Room" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="Lounge" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedView === 'bydayofweek' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Facility Usage by Day of Week</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Cafe" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="Library" stackId="a" fill="#3B82F6" />
                  <Bar dataKey="Gym" stackId="a" fill="#EF4444" />
                  <Bar dataKey="Conference Room" stackId="a" fill="#10B981" />
                  <Bar dataKey="Lounge" stackId="a" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedView === 'bypersonatype' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Facility Usage by Persona Type</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={personaUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="persona" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Cafe" fill="#F59E0B" />
                  <Bar dataKey="Library" fill="#3B82F6" />
                  <Bar dataKey="Gym" fill="#EF4444" />
                  <Bar dataKey="Conference Room" fill="#10B981" />
                  <Bar dataKey="Lounge" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 h-12 flex items-center justify-between px-8 text-sm text-[#666666]">
        <div>Facility Analytics Dashboard v1.0</div>
        <div>Made by Suhyeon Lee</div>
      </footer>
    </div>
  );
};

export default FacilityAnalytics;