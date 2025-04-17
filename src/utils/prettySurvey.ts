// utils/prettySurvey.ts

interface SurveyType {
    goals?: string[];
    feedbackStyle?: string;
    selfState?: string;
    emotions?: string[];
    timeZone?: string;
    timePerRoutine?: string;
    partnerType?: string;
}

export const prettySurveySummary = (survey: SurveyType) => {
    return [
        { label: '목표', value: survey.goals?.join(', ') || '없음' },
        { label: '현재 감정 상태', value: survey.selfState || '없음' },
        { label: '감정 키워드', value: (survey.emotions || []).join(', ') || '없음' },
        { label: '루틴 시간대', value: survey.timeZone || '없음' },
        { label: '하나에 쓸 수 있는 시간', value: survey.timePerRoutine || '없음' },
        { label: '캐릭터 파트너 유형', value: survey.partnerType || '없음' },
    ];
};
