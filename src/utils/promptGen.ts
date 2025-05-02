// utils/promptGen.ts
import { SurveyContextType } from '../content/SurveyContext';

export const generateRoutinePrompt = (survey: SurveyContextType["survey"], customInput: string): string => {
    const {
        goals,
        timeZone,
        timePerRoutine,
        feedbackStyle,
        personality,
        selfState,
        emotions,
        obstacle
    } = survey;

    return `당신은 감정 기반 루틴 설계 전문가입니다.

🧠 사용자 정보:
- 목표: ${goals.join(', ')}
-사용자의 의견 : ${customInput}
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
- 각 루틴은 **하나의 명확한 행동을 지시하는 1문장**으로 작성하세요.
- 문장 끝은 반드시 **"하기" 형태**여야 하며, 주어나 조건 없이 **핵심 행동만 간결하게** 작성하세요.
  (예: "고마운 점 한 가지 적기", "감정 단어 떠올리기", "짧은 편지 쓰기")
- 시간대나 활동 전후 조건(예: 아침에, 운동 전 등)은 포함하지 마세요.
- 흔한 루틴(예: 물 마시기, 심호흡)은 제외하세요.
- 감정 공감 또는 자기 인식을 이끌 수 있어야 합니다.
- 5~10분 이내에 가능한 행동만 제시하세요.
- 루틴 문장 외의 모든 설명은 금지합니다.


📋 출력 형식 (번호 포함, 딱 4줄):
1. (루틴 문장)  
2. (루틴 문장)  
3. (루틴 문장)  
4. (루틴 문장)

`;

}
