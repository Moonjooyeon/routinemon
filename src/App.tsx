import { Routes, Route } from 'react-router-dom';
import { SurveyProvider } from './content/SurveyContext';

import GoalPage from './pages/GoalPage';
import TimePage from './pages/TimePage';
import RoutineTime from './pages/RoutineTime';
import PersonalityPage from './pages/PersonalityPage';
import EmotionPage from './pages/EmotionPage';
import SummaryPage from './pages/SummaryPage';
import RoutineSelectionPage from './pages/RoutineSelectionPage';
import RoutineEditPage from './pages/RoutineEditPage';
import RoutineOpinionPage from './pages/RoutineOpinionPage';
import RoutineStartPage from "./pages/RoutineStartPage.tsx";

const App = () => {
    return (
        <SurveyProvider>
            <Routes>
                <Route path="/" element={<GoalPage />} />
                <Route path="/time" element={<TimePage />} />
                <Route path="/time-duration" element={<RoutineTime />} />
                <Route path="/personality" element={<PersonalityPage />} />
                <Route path="/emotion" element={<EmotionPage />} />
                <Route path="/summary" element={<SummaryPage />} />
                <Route path="/routine-opinion" element={<RoutineOpinionPage />} />
                <Route path="/routines" element={<RoutineSelectionPage />} />
                <Route path="/routine-customize" element={<RoutineEditPage />} />
                <Route path="/main" element={<RoutineStartPage />} />
            </Routes>
        </SurveyProvider>
    );
};

export default App;
