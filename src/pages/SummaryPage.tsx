import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';
import { prettySurveySummary } from '../utils/prettySurvey';
import { useState } from 'react';
import SurveyModal from '../components/SurveyModal';

const SurveySummaryPage = () => {
    const { survey } = useSurvey();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(true);

    const handleNext = () => {
        setModalOpen(false);
        navigate('/routine-opinion');
    };

    return (
        <SurveyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onNext={handleNext}>
            <h2 style={{ marginBottom: '1rem' }}>📝 당신의 루틴 설문 요약</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {prettySurveySummary(survey).map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>
                        <strong>{item.label}:</strong> {item.value}
                    </li>
                ))}
            </ul>
        </SurveyModal>
    );
};

export default SurveySummaryPage;
