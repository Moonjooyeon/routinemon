import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';
import { ExecutionTime } from '../content/SurveyContext'; // 만약 interface를 export 했을 경우!

const RoutineTime = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();

    const handleDurationChange = (timeZone: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        const duration = parseInt(e.target.value);
        const updatedExecutionTimes = survey.execution_times.map((item: ExecutionTime) => {
            if (item.time_zone === timeZone) {
                return { ...item, duration };
            }
            return item;
        });
        setSurvey({ ...survey, execution_times: updatedExecutionTimes });
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>각 시간대별로 몇 분 정도 루틴을 할까요?</h2>
            <p>시간대별로 선택해 주세요!</p>

            {survey.execution_times?.map((item: ExecutionTime) => (
                <div key={item.time_zone} style={{ marginBottom: '1rem' }}>
                    <p>{item.time_zone}</p>
                    <select
                        value={item.duration}
                        onChange={(e) => handleDurationChange(item.time_zone, e)}
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

            <div style={{ marginTop: '2rem' }}>
                <button onClick={() => navigate('/personality')}>다음</button>
            </div>
        </div>
    );
};

export default RoutineTime;
