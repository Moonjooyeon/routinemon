//import React from 'react';
import {Routes, Route } from 'react-router-dom';
import { SurveyProvider } from './content/SurveyContext';

import GoalPage from './pages/GoalPage';
import TimePage from './pages/TimePage';
import RoutineTime from './pages/RoutineTime';
import PersonalityPage from './pages/PersonalityPage';
import EmotionPage from './pages/EmotionPage';
import PartnerPage from './pages/PartnerPage';
import SummaryPage from './pages/SummaryPage';
import RoutineListPage from './pages/RoutineListPage';


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
                <Route path="/partner" element={<PartnerPage/>}/>
                <Route path="/summary" element={<SummaryPage/>}/>
                <Route path="/routines" element={<RoutineListPage />} />

            </Routes>
        </SurveyProvider>
    );
}



    export default App;