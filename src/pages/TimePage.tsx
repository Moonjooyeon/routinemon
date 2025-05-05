import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';
import SurveyModal from '../components/SurveyModal';
import { ExecutionTime } from '../content/SurveyContext';

const TimePage = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(true);

    const handleTimeZoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        let updatedExecutionTimes = survey.execution_times || [];

        if (checked) {
            updatedExecutionTimes.push({ time_zone: value, duration: 0 });
        } else {
            updatedExecutionTimes = updatedExecutionTimes.filter((item: ExecutionTime) => item.time_zone !== value);
        }

        setSurvey({ ...survey, execution_times: updatedExecutionTimes });
    };

    const handleNext = () => {
        setModalOpen(false);
        navigate('/time-duration'); // 다음 페이지로
    };

    return (
        <SurveyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onNext={handleNext}>
            <h2 style={{ marginBottom: '1rem' }}>⏰ 언제가 당신의 루틴 타임인가요?</h2>
            <p style={{ marginBottom: '1rem' }}>하루 중, 나랑 제일 잘 맞는 시간은 언제예요?</p>

            {["아침", "점심", "저녁"].map((zone) => (
                <label key={zone} style={{ display: 'block', marginBottom: '0.5rem' }}>
                    <input
                        type="checkbox"
                        value={zone}
                        checked={survey.execution_times?.some((item: ExecutionTime) => item.time_zone === zone)}
                        onChange={handleTimeZoneChange}
                        style={{ marginRight: '0.5rem' }}
                    />
                    {zone}
                </label>
            ))}
        </SurveyModal>
    );
};

export default TimePage;
