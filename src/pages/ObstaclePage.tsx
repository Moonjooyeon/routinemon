import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';

const ObstaclePage = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2>실패했을 때, 어떤 피드백이 좋나요?</h2>
            <p>"요즘 나, 어떤 삶을 꿈꾸냐고 묻는다면...."</p>
            <p>대신 어떤 말이 위로되세요?</p>

            <select
                value={survey.obstacle}
                onChange={(e) => setSurvey({ ...survey, obstacle: e.target.value })}
            >
                <option value="">선택하세요</option>
                <option value="귀찮아서">귀찮아서</option>
                <option value="너무 피곤해서">너무 피곤해서</option>
                <option value="시간 부족">시간 부족</option>
                <option value="재미없어서">재미없어서</option>
                <option value="의미 없다고 느껴서">의미 없다고 느껴서</option>
                <option value="기타">기타</option>
            </select>

            <div style={{ marginTop: '2rem' }}>
                <button onClick={() => navigate('/partner')}>다음</button>
            </div>
        </div>
    );
};

export default ObstaclePage;