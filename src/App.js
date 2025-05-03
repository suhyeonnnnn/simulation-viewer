import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PersonaGenerationPage from "./pages/PersonaGenerationPage";
import FacilityDesignPage from "./pages/FacilityDesignPage";
import SimulationPage from "./pages/SimulationPage";
import ResultAnalysisPage from "./pages/ResultAnalysisPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/personas" element={<PersonaGenerationPage />} />
        <Route path="/facilities" element={<FacilityDesignPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/results" element={<ResultAnalysisPage />} />
      </Routes>
    </Router>
  );
}

export default App; // ✅ 이 줄이 반드시 있어야 함!
