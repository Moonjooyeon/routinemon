import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';

const EmotionPage = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();

    const toggleEmotion = (emotion: string) => {
        const updated = survey.emotions.includes(emotion)
            ? survey.emotions.filter(e => e !== emotion)
            : [...survey.emotions, emotion];
        setSurvey({ ...survey, emotions: updated });
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2>지금의 나를 한 마디로 표현한다면?</h2>
            <input
                type="text"
                value={survey.selfState}
                onChange={(e) => setSurvey({ ...survey, selfState: e.target.value })}
                placeholder="예: 무기력, 바쁨, 의욕적 등"
            />

            <h2 style={{ marginTop: '2rem' }}>요즘 자주 느끼는 감정을 모두 골라주세요</h2>
            <label>
                <input
                    type="checkbox"
                    onChange={() => toggleEmotion('불안')}
                    checked={survey.emotions.includes('불안')}
                /> 불안
            </label>
            <label>
                <input
                    type="checkbox"
                    onChange={() => toggleEmotion('지침')}
                    checked={survey.emotions.includes('지침')}
                /> 지침
            </label>
            <label>
                <input
                    type="checkbox"
                    onChange={() => toggleEmotion('기대')}
                    checked={survey.emotions.includes('기대')}
                /> 기대
            </label>
            <label>
                <input
                    type="checkbox"
                    onChange={() => toggleEmotion('외로움')}
                    checked={survey.emotions.includes('외로움')}
                /> 외로움
            </label>
            <label>
                <input
                    type="checkbox"
                    onChange={() => toggleEmotion('평온함')}
                    checked={survey.emotions.includes('평온함')}
                /> 평온함
            </label>

            <div style={{ marginTop: '2rem' }}>
                <button onClick={() => navigate('/partner')}>다음</button>
            </div>
        </div>
    );
};

export default EmotionPage;