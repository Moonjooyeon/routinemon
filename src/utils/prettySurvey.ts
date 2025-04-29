interface ExecutionTime {
    time_zone: string;
    duration: number;
}

interface SurveyType {
    goals?: string[];
    feedbackStyle?: string;
    selfState?: string;
    emotions?: string[];
    execution_times?: ExecutionTime[];
}

export const prettySurveySummary = (survey: SurveyType) => {
    const timezones = survey.execution_times?.map(et => et.time_zone).join(', ') || '없음';
    const durations = survey.execution_times?.map(et => `${et.time_zone}: ${et.duration}분`).join(' / ') || '없음';

    return [
        { label: '목표', value: survey.goals?.join(', ') || '없음' },
        { label: '현재 감정 상태', value: survey.selfState || '없음' },
        { label: '감정 키워드', value: (survey.emotions || []).join(', ') || '없음' },
        { label: '루틴 시간대', value: timezones },
        { label: '하나에 쓸 수 있는 시간', value: durations },
    ];
};
