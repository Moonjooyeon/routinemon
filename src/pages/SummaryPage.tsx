import { useState } from 'react';
import { useSurvey } from '../content/SurveyContext';
import { useNavigate } from 'react-router-dom';
import { generateRoutinePrompt } from '../utils/promptGen';
import { chatWithGPT } from '../utils/chatWithGPT';

const SummaryPage = () => {
    const { survey } = useSurvey();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const navigate = useNavigate();

    const handleGenerate = async () => {
        setLoading(true);
        const prompt = generateRoutinePrompt(survey);
        try {
            const response = await chatWithGPT(prompt);
            setResult(response);
        } catch (err) {
            console.error(err);
            setResult('오류가 발생했어요. 다시 시도해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
            <h2>당신의 루틴 설문 요약</h2>
            <pre>{JSON.stringify(survey, null, 2)}</pre>

            <button onClick={handleGenerate} disabled={loading}>
                {loading ? '생성 중...' : 'AI 루틴 생성하기'}
            </button>

            {result && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>✨ 루틴 제안 결과</h3>
                    <pre>{result}</pre>
                    <button onClick={() => navigate('/')}>처음부터 다시하기</button>
                </div>
            )}
        </div>
    );
};

export default SummaryPage;
