//import React from 'react';
import {Routes, Route } from 'react-router-dom';
import { SurveyProvider } from './content/SurveyContext';

import GoalPage from './pages/GoalPage';
import TimePage from './pages/TimePage';
import RoutineTime from './pages/RoutineTime';
import PersonalityPage from './pages/PersonalityPage';
import EmotionPage from './pages/EmotionPage';
import ObstaclePage from './pages/ObstaclePage';
import PartnerPage from './pages/PartnerPage';
import SummaryPage from './pages/SummaryPage';

const App = () => {
    // App.tsx
    return (
        <SurveyProvider>
            <Routes>
                <Route path="/" element={<GoalPage/>}/>
                <Route path="/time" element={<TimePage/>}/>
                <Route path="/time-duration" element={<RoutineTime/>}/>
                <Route path="/personality" element={<PersonalityPage/>}/>
                <Route path="/emotion" element={<EmotionPage/>}/>
                <Route path="/obstacle" element={<ObstaclePage/>}/>
                <Route path="/partner" element={<PartnerPage/>}/>
                <Route path="/summary" element={<SummaryPage/>}/>
            </Routes>
        </SurveyProvider>
    );
}



    export default App;