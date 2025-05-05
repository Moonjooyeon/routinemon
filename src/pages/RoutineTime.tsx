import { useSurvey } from '../content/SurveyContext';
import { ExecutionTime } from '../content/SurveyContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyModal from '../components/SurveyModal';

const RoutineTime = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(true);

    const handleDurationChange = (timeZone: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        const duration = parseInt(e.target.value);
        const updatedExecutionTimes = survey.execution_times.map((item: ExecutionTime) =>
            item.time_zone === timeZone ? { ...item, duration } : item
        );
        setSurvey({ ...survey, execution_times: updatedExecutionTimes });
    };

    const handleNext = () => {
        setModalOpen(false);
        navigate('/personality');
    };

    return (
        <SurveyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onNext={handleNext}>
            <h2 style={{ marginBottom: '1rem' }}>각 시간대별로 몇 분 정도 루틴을 할까요?</h2>
            <p style={{ marginBottom: '1rem' }}>시간대별로 선택해 주세요!</p>

            {survey.execution_times?.map((item: ExecutionTime) => (
                <div key={item.time_zone} style={{ marginBottom: '1rem' }}>
                    <strong>{item.time_zone}</strong>
                    <select
                        value={item.duration}
                        onChange={(e) => handleDurationChange(item.time_zone, e)}
                        style={{ marginLeft: '1rem' }}
                    >
                        <option value={0}>선택하세요</option>
                        <option value={10}>10분</option>
                        <option value={20}>20분</option>
                        <option value={30}>30분</option>
                        <option value={40}>40분</option>
                        <option value={50}>50분</option>
                        <option value={60}>60분</option>
                    </select>
                </div>
            ))}
        </SurveyModal>
    );
};

export default RoutineTime;
