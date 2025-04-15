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
        partnerType,
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
- 캐릭터 파트너: ${partnerType}

🎯 요청:
사용자에게 적합한 **감정적으로 몰입 가능한 루틴 6가지를 추천**해주세요.
조건:
- 단계형 구조 (2단계 이하), 구체적인 행동
- 감정 공감, 자기 인식 유도
- 너무 단순하거나 흔한 루틴 제외
- 콘셉트 제목 + 간단 설명 + 구체 행동

📋 출력 예시:
1. ✍️ 내 마음 들여다보기  
- 콘셉트: 감정을 기록하며 감정의 뿌리를 찾는 루틴  
- 행동: 오늘 가장 강하게 느낀 감정을 한 단어로 적고, 그 이유를 두 문장으로 써보기`;
};
