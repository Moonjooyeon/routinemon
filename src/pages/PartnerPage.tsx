import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';

const PartnerPage = () => {
    const { survey, setSurvey } = useSurvey();
    const navigate = useNavigate();

    const partnerOptions = [
        { label: '🌱 조용하지만 단단한 식물형', value: '식물형' },
        { label: '🐾 귀엽고 말 많은 동물형', value: '동물형' },
        { label: '🔮 상상력 폭발 마법형', value: '마법형' },
        { label: '🎁 랜덤 추천 받기 (나도 몰라, 두근두근!)', value: '랜덤형' },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2>나랑 함께할 성격의 루틴친구는 누구?</h2>
            {partnerOptions.map((option) => (
                <label key={option.value} style={{ display: 'block', marginBottom: '0.5rem' }}>
                    <input
                        type="radio"
                        name="partnerType"
                        value={option.value}
                        checked={survey.partnerType === option.value}
                        onChange={(e) => setSurvey({ ...survey, partnerType: e.target.value })}
                    />{' '}
                    {option.label}
                </label>
            ))}

            <div style={{ marginTop: '2rem' }}>
                <button onClick={() => navigate('/summary')}>루틴 생성하기</button>
            </div>
        </div>
    );
};

export default PartnerPage;