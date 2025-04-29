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

    return `당신은 감정 기반 루틴 설계 전문가입니다.

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
사용자의 감정 몰입을 유도할 수 있는 루틴 4가지를 추천하세요.

조건:
- 각 루틴은 구체적인 1문장 행동 지시로 작성하세요.
- 2단계 이하로 단순하고 직관적인 구조여야 합니다.
- '물 마시기', '심호흡' 같은 흔한 루틴은 제외하세요.
- 감정 공감 또는 자기 인식을 이끌어야 합니다.
- 5~10분 이내로 실천 가능한 행동만 제시하세요.
- **루틴 문장에는 시간대나 활동 전후 조건을 포함하지 마세요.**
- 루틴 문장 외 모든 설명은 금지합니다.


📋 출력 형식 (번호 포함, 딱 4줄):
1. (루틴 문장)  
2. (루틴 문장)  
3. (루틴 문장)  
4. (루틴 문장)

`;

}
