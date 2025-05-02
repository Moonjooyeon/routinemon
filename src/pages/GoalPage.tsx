import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';

const GoalPage = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();

    const toggleGoal = (goal: string) => {
        const updated = survey.goals.includes(goal)
            ? survey.goals.filter((g) => g !== goal)
            : [...survey.goals, goal];

        setSurvey({ ...survey, goals: updated });
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>당신의 오늘, 어떤 루틴을 만들고 싶나요?</h2>
            <p>"요즘 나, 어떤 삶을 꿈꾸냐고 묻는다면...."</p>
            <p>복수 선택 가능해요 😊</p>

            <label>
                <input
                    type="checkbox"
                    onChange={() => toggleGoal('몸을 좀 움직여야겠다 (운동, 스트레칭 등)')}
                    checked={survey.goals.includes('몸을 좀 움직여야겠다 (운동, 스트레칭 등)')}
                />{' '}
                몸을 좀 움직여야겠다 (운동, 스트레칭 등)
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    onChange={() => toggleGoal('뇌가 녹기 전에 뭔가를 배우고 싶다 (공부, 외국어 등)')}
                    checked={survey.goals.includes('뇌가 녹기 전에 뭔가를 배우고 싶다 (공부, 외국어 등)')}
                />{' '}
                뇌가 녹기 전에 뭔가를 배우고 싶다 (공부, 외국어 등)
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    onChange={() => toggleGoal('내 감정을 나도 좀 알고 싶다 (감정 일기, 명상 등)')}
                    checked={survey.goals.includes('내 감정을 나도 좀 알고 싶다 (감정 일기, 명상 등)')}
                />{' '}
                내 감정을 나도 좀 알고 싶다 (감정 일기, 명상 등)
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    onChange={() => toggleGoal('생활 루틴 좀 챙겨보자 (기상/취침, 정리정돈 등)')}
                    checked={survey.goals.includes('생활 루틴 좀 챙겨보자 (기상/취침, 정리정돈 등)')}
                />{' '}
                생활 루틴 좀 챙겨보자 (기상/취침, 정리정돈 등)
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    onChange={() => toggleGoal('일단, 작심삼일 말고 작심 사일만 해도 좋겠어')}
                    checked={survey.goals.includes('일단, 작심삼일 말고 작심 사일만 해도 좋겠어')}
                />{' '}
                일단, 작심삼일 말고 작심 ‘사일’만 해도 좋겠어
            </label>

            <div style={{ marginTop: '2rem' }}>
                <button onClick={() => navigate('/time')}>다음</button>
            </div>
        </div>
    );
};

export default GoalPage;
