import { createContext, useContext, useState, ReactNode } from 'react';

interface SurveyProviderProps {
    children: ReactNode;
}

const initialSurvey = {
    goals: [] as string[],
    timeZone: '',
    timePerRoutine: '',
    feedbackStyle: '',
    personality: '',
    selfState: '',
    emotions: [] as string[],
    obstacle: '',
    partnerType: '',
};

export type SurveyContextType = {
    survey: typeof initialSurvey;
    setSurvey: React.Dispatch<React.SetStateAction<typeof initialSurvey>>;
};

const SurveyContext = createContext<SurveyContextType | null>(null);

export const useSurvey = () => {
    const context = useContext(SurveyContext);
    if (!context) throw new Error('useSurvey must be used within a SurveyProvider');
    return context;
};

export const SurveyProvider = ({ children }: SurveyProviderProps) => {
    const [survey, setSurvey] = useState(initialSurvey);

    return (
        <SurveyContext.Provider value={{ survey, setSurvey }}>
            {children}
        </SurveyContext.Provider>
    );
};