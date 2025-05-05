import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';
import { useState } from 'react';
import SurveyModal from '../components/SurveyModal';

const EmotionPage = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(true);

    const toggleEmotion = (emotion: string) => {
        const updated = survey.emotions.includes(emotion)
            ? survey.emotions.filter(e => e !== emotion)
            : [...survey.emotions, emotion];
        setSurvey({ ...survey, emotions: updated });
    };

    const handleNext = () => {
        setModalOpen(false);
        navigate('/summary');
    };

    return (
        <SurveyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onNext={handleNext}>
            <h2 style={{ marginBottom: '1rem' }}>지금의 나를 한 마디로 표현한다면?</h2>
            <input
                type="text"
                value={survey.selfState}
                onChange={(e) => setSurvey({ ...survey, selfState: e.target.value })}
                placeholder="예: 무기력, 바쁨, 의욕적 등"
                style={{ padding: '0.5rem', fontSize: '1rem', width: '100%', marginBottom: '1.5rem' }}
            />

            <h2 style={{ marginBottom: '1rem' }}>요즘 자주 느끼는 감정을 모두 골라주세요</h2>
            {['불안', '지침', '기대', '외로움', '평온함'].map((emotion) => (
                <label key={emotion} style={{ display: 'block', marginBottom: '0.5rem' }}>
                    <input
                        type="checkbox"
                        onChange={() => toggleEmotion(emotion)}
                        checked={survey.emotions.includes(emotion)}
                    />{' '}{emotion}
                </label>
            ))}
        </SurveyModal>
    );
};

export default EmotionPage;
