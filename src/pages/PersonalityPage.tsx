import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';
import { useState } from 'react';
import SurveyModal from '../components/SurveyModal';

const PersonalityPage = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(true);

    const handleNext = () => {
        setModalOpen(false);
        navigate('/emotion');
    };

    return (
        <SurveyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onNext={handleNext}>
            <h2 style={{ marginBottom: '1rem' }}>실패했을 때 어떤 피드백이 위로가 되나요?</h2>
            <select
                value={survey.feedbackStyle}
                onChange={(e) => setSurvey({ ...survey, feedbackStyle: e.target.value })}
                style={{ padding: '0.5rem', fontSize: '1rem', width: '100%' }}
            >
                <option value="">선택</option>
                <option value="위로">“괜찮아, 오늘은 그런 날이었잖아”</option>
                <option value="조언">“왜 그런지 같이 분석해보자!”</option>
                <option value="무응답">“음... 그냥 넘어가자”</option>
            </select>
        </SurveyModal>
    );
};

export default PersonalityPage;
