import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PageWithTabs } from './components/Tabs'; 
import LandingPage from "./pages/LandingPage";
import PersonaGenerationPage from "./pages/PersonaGenerationPage";
import FacilityDesignPage from "./pages/FacilityDesignPage";
import SimulationPage from "./pages/SimulationPage";
import ResultAnalysisPage from "./pages/ResultAnalysisPage";
import WhatIfScenarioPage from "./pages/WhatIfScenarioPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/facilities" element={
          <PageWithTabs activeStage="Facilities">
            <FacilityDesignPage />
          </PageWithTabs>
        } />
        <Route path="/personas" element={
          <PageWithTabs activeStage="Personas">
            <PersonaGenerationPage />
          </PageWithTabs>
        } />
        <Route path="/simulation" element={
          <PageWithTabs activeStage="Simulation">
            <SimulationPage />
          </PageWithTabs>
        } />
        <Route path="/what-if" element={
          <PageWithTabs activeStage="What If">
            <WhatIfScenarioPage />
          </PageWithTabs>
        } />
        <Route path="/results" element={
          <PageWithTabs activeStage="Results">
            <ResultAnalysisPage />
          </PageWithTabs>
        } />
      </Routes>
    </Router>
  );
}

export default App;