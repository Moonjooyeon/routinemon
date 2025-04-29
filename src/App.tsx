//import React from 'react';
import {Routes, Route } from 'react-router-dom';
import { SurveyProvider } from './content/SurveyContext';

import GoalPage from './pages/GoalPage';
import TimePage from './pages/TimePage';
import RoutineTime from './pages/RoutineTime';
import PersonalityPage from './pages/PersonalityPage';
import EmotionPage from './pages/EmotionPage';
import SummaryPage from './pages/SummaryPage';
import RoutineListPage from './pages/RoutineListPage';
import RoutineEditPage from './pages/RoutineEditPage';


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
                <Route path="/summary" element={<SummaryPage/>}/>
                <Route path="/routines" element={<RoutineListPage />} />
                <Route path="/routines/:id/edit" element={<RoutineEditPage />} />


            </Routes>
        </SurveyProvider>
    );
}



    export default App;