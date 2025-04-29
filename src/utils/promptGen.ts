// utils/promptGen.ts
import { SurveyContextType } from '../content/SurveyContext';

export const generateRoutinePrompt = (survey: SurveyContextType['survey']): string => {
    const {
        goals,
        timeZone,
        timePerRoutine,
        feedbackStyle,
        personality,
        selfState,
        emotions,
        obstacle,
    } = survey;

    return `당신은 사용자의 감정과 행동 패턴을 기반으로 루틴을 설계하는 루틴 생성 코치입니다.

🧠 사용자 정보:
- 목표: ${goals.join(', ')}
- 하루 실천 가능 시간대: ${timeZone}
- 루틴당 시간: ${timePerRoutine}
- 성격 유형: ${personality}
- 실패 시 선호 피드백: ${feedbackStyle}
- 현재 상태: ${selfState}
- 자주 드는 감정: ${emotions.join(', ')}
- 루틴 지속 실패 이유: ${obstacle}

🎯 요청:
사용자에게 적합한 **감정적으로 몰입 가능한 루틴 4가지를 추천**해주세요.
조건:
- 단계형 구조 (2단계 이하), 구체적인 행동
- 감정 공감, 자기 인식 유도
- 너무 단순하거나 흔한 루틴 제외
- 콘셉트 제목 + 간단 설명 + 구체 행동

📋 출력 예시:
사용자가 하루 5~10분 정도 집중할 수 있다고 가정하고, 다음 조건에 맞춰 루틴 4개를 추천해 주세요:

- 단순한 동작보다 의미 있는 내면 반응을 이끌어내는 행동
- 단계형 구조 (예: 1단계: 눈 감기 → 2단계: 감정 적기)
- 감정적 몰입 또는 자기 인식 유도
- 콘셉트 제목 + 설명 + 구체적인 행동 문장 포함
- 이미 흔하게 접하는 루틴(ex. 물 마시기, 심호흡 3회)은 제외
- 행동은 딱 1줄로 눈에 들어오기.

루틴은 아래와 같은 형식으로 4개 제시해주세요:

1. 📘 루틴 제목
- 목표: 
- 행동:`;

}
