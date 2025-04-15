import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';

const TimePage = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem' }}>
            <h2>언제가 당신의 루틴 타임인가요?</h2>
            <p>"하루 중, 나랑 제일 잘 맞는 시간은 언제예요?"</p>
            <p>루틴 추천에 활용할게요! </p>

            <select
                value={survey.timeZone}
                onChange={(e) => setSurvey({ ...survey, timeZone: e.target.value })}
            >
                <option value="">선택하세요</option>
                <option value="아침 (6~9시)">아침 햇살과 함께 시작해볼래요 (6~9시)</option>
                <option value="점심 (12~14시)">점심시간 짬짬이 (12~14시)</option>
                <option value="저녁 (18~22시)">하루를 정리하며 차분히 (18~22시)</option>
                <option value="취침 전 (22~24시)">잠들기 직전, 나에게 집중하는 시간 (22~24시)</option>
            </select>

            <div style={{ marginTop: '2rem' }}>
                <button onClick={() => navigate('/time-duration')}>다음</button>
            </div>
        </div>
    );
};

export default TimePage;
