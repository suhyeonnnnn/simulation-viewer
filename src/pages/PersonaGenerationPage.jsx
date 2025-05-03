import React, { useState } from "react";
import PersonaCard from "../components/PersonaCard";
import StageTabs from "../components/StageTabs";

export default function PersonaGenerationPage() {
  const [gender, setGender] = useState("Any");
  const [ageGroup, setAgeGroup] = useState("20s");
  const [k, setK] = useState(3);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStage, setActiveStage] = useState("Personas");

  const handleGenerate = async () => {
    setLoading(true);
    const prompt = `
Generate ${k} realistic personas in JSON format for a simulation of community facility usage.
Each persona must include these fields:
- age_group (e.g., "10s", "20s", "30s")
- gender (e.g., "Male", "Female")
- preferred_facilities (2–4 plausible facilities)
- profile_prompt (1st-person intro, 2-3 sentences)

Use:
- age_group: ${ageGroup}
- gender: ${gender === "Any" ? "Mixed" : gender}
- Format: Output only a JSON array, no explanation.
    `.trim();

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const message = data.choices?.[0]?.message?.content;
      const parsed = JSON.parse(message);
      setPersonas(parsed);
    } catch (err) {
      alert("Failed to generate personas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center p-8 text-center"
      style={{ backgroundColor: "#f7f6f3", fontFamily: "'VT323', monospace" }}
    >
      <StageTabs activeStage="Personas" />


      <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "'Press Start 2P', cursive" }}>
        Create AI Personas
      </h2>

      {/* 입력 폼 */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div>
          <label className="block text-lg font-medium mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="Any">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium mb-1">Age Group</label>
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="10s">10s</option>
            <option value="20s">20s</option>
            <option value="30s">30s</option>
            <option value="40s">40s</option>
            <option value="50s+">50s+</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium mb-1"># of Personas</label>
          <input
            type="number"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            min={1}
            max={10}
            className="border border-gray-300 p-2 rounded w-24"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-yellow-300 hover:bg-yellow-400 text-black px-8 py-3 text-lg font-bold rounded-xl shadow-lg border-2 border-black"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        {loading ? "Generating..." : "Generate Personas"}
      </button>

      {/* 생성된 페르소나 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {personas.map((p, idx) => (
          <PersonaCard key={idx} persona={p} index={idx} />
        ))}
      </div>
    </div>
  );
}
