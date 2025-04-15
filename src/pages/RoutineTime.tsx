import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';

const RoutineTime = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem' }}>
            <h2>3️⃣ 루틴 하나에 쓸 수 있는 시간은?</h2>
            <p>“진짜 딱 요만큼이면 괜찮다 싶은 시간!”</p>

            <select
                value={survey.timePerRoutine}
                onChange={(e) => setSurvey({ ...survey, timePerRoutine: e.target.value })}
            >
                <option value="">선택하세요</option>
                <option value="5분 이하">5분 컷 루틴이 최고</option>
                <option value="10분 내외">10분 정도면 나도 할 수 있어</option>
                <option value="30분 이상">30분 이상, 진지하게 몰입하고 싶어요</option>
            </select>

            <div style={{ marginTop: '2rem' }}>
                <button onClick={() => navigate('/personality')}>다음</button>
            </div>
        </div>
    );
};

export default RoutineTime;