import { createContext, useContext, useState, ReactNode } from 'react';

export interface ExecutionTime {
    time_zone: string;
    duration: number;
}

interface Survey {
    goals: string[];
    timeZone: string;
    execution_times: ExecutionTime[];
    timePerRoutine: string;
    feedbackStyle: string;
    personality: string;
    selfState: string;
    emotions: string[];
    obstacle: string;
    customInput : string;
}

interface SurveyProviderProps {
    children: ReactNode;
}

const initialSurvey: Survey = {
    goals: [],
    timeZone: '',
    execution_times: [],
    timePerRoutine: '',
    feedbackStyle: '',
    personality: '',
    selfState: '',
    emotions: [],
    obstacle: '',
    customInput: ''
};

export type SurveyContextType = {
    survey: Survey;
    setSurvey: React.Dispatch<React.SetStateAction<Survey>>;
};

const SurveyContext = createContext<SurveyContextType | null>(null);

export const useSurvey = () => {
    const context = useContext(SurveyContext);
    if (!context) throw new Error('useSurvey must be used within a SurveyProvider');
    return context;
};

export const SurveyProvider = ({ children }: SurveyProviderProps) => {
    const [survey, setSurvey] = useState<Survey>(initialSurvey);

    return (
        <SurveyContext.Provider value={{ survey, setSurvey }}>
            {children}
        </SurveyContext.Provider>
    );
};
