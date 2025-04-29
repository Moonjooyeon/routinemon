import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';

const TimePage = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();

    const handleTimeZoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        let updatedExecutionTimes = survey.execution_times || [];

        if (checked) {
            // 추가
            updatedExecutionTimes.push({ time_zone: value, duration: 0 });
        } else {
            // 제거
            updatedExecutionTimes = updatedExecutionTimes.filter((item: any) => item.time_zone !== value);
        }

        setSurvey({ ...survey, execution_times: updatedExecutionTimes });
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>언제가 당신의 루틴 타임인가요?</h2>
            <p>"하루 중, 나랑 제일 잘 맞는 시간은 언제예요?"</p>

            {["아침", "점심", "저녁"].map((zone) => (
                <div key={zone}>
                    <label>
                        <input
                            type="checkbox"
                            value={zone}
                            checked={survey.execution_times?.some((item: any) => item.time_zone === zone)}
                            onChange={handleTimeZoneChange}
                        />
                        {zone}
                    </label>
                </div>
            ))}

            <div style={{ marginTop: '2rem' }}>
                <button onClick={() => navigate('/time-duration')}>다음</button>
            </div>
        </div>
    );
};

export default TimePage;
