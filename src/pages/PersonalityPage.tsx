import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';

const PersonalityPage = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2>당신은 어떤 유형에 가까운가요?</h2>
            <select
                value={survey.personality}
                onChange={(e) => setSurvey({ ...survey, personality: e.target.value })}
            >
                <option value="">선택</option>
                <option value="계획형">계획형</option>
                <option value="유연형">유연형</option>
                <option value="귀찮음 방지형">귀찮음 방지형</option>
            </select>

            <h2 style={{ marginTop: '2rem' }}>실패했을 때 어떤 피드백이 위로가 되나요?</h2>
            <select
                value={survey.feedbackStyle}
                onChange={(e) => setSurvey({ ...survey, feedbackStyle: e.target.value })}
            >
                <option value="">선택</option>
                <option value="위로">“괜찮아, 오늘은 그런 날이었잖아”</option>
                <option value="조언">“왜 그런지 같이 분석해보자!”</option>
                <option value="무응답">“음... 그냥 넘어가자”</option>
            </select>

            <div style={{ marginTop: '2rem' }}>
                <button onClick={() => navigate('/emotion')}>다음</button>
            </div>
        </div>
    );
};

export default PersonalityPage;
