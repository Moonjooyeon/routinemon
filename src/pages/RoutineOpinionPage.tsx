import { useNavigate } from 'react-router-dom';
import { useSurvey } from '../content/SurveyContext';
import { useState } from 'react';
import SurveyModal from '../components/SurveyModal';
import { generateRoutinePrompt } from '../utils/promptGen';
import { chatWithGPT } from '../utils/chatWithGPT';
// import axios from 'axios'; // 저장 안 할 거면 주석 처리

const RoutineOpinionPage = () => {
    const { survey } = useSurvey();
    const navigate = useNavigate();
    const [customInput, setCustomInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(true);

    // 저장 로직 (나중에 백엔드 붙이면 활성화)
    /*
    const submitSurveyAnswers = async () => {
        const guestId = localStorage.getItem('guest_id'); // 임시 아이디
        const entries = [
            { question: 'goals', answer: survey.goals.join(', ') },
            { question: 'preferred_time', answer: survey.execution_times.map(et => et.time_zone).join(', ') },
            { question: 'time_per_routine', answer: survey.timePerRoutine },
            { question: 'feedback_style', answer: survey.feedbackStyle },
            { question: 'self_state', answer: survey.selfState },
        ];
        await axios.post('http://localhost:8080/user-survey-answers', entries, {
            headers: {
                'X-Guest-Id': guestId,
                'Content-Type': 'application/json',
            },
        });
    };
    */

    const handleGenerate = async () => {
        setLoading(true);
        try {
            // await submitSurveyAnswers(); // 저장은 나중에!
            const prompt = generateRoutinePrompt(survey, customInput);
            const response = await chatWithGPT(prompt);
            const parsed = response
                .split(/\n\d+\.\s/)
                .filter((r) => r.trim() !== '')
                .map((r) => ({
                    text: r.trim().replace(/^\d+\.\s*/, ''),
                    isEditing: false,
                    color: '#FFB6C1',
                    emoji: '',
                    daysOfWeek: [],
                    group: '기본'
                }));
            navigate('/routines', { state: { generatedRoutines: parsed } });
        } catch (err) {
            console.error('❌ GPT 호출 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SurveyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onNext={handleGenerate} showNext={false}>
            <h2 style={{ marginBottom: '1rem' }}>🎯 달성하고자 하는 목표나, 루틴에 포함되었으면 하는 행동 키워드를 자유롭게 입력해주세요!</h2>
            <p>선택 입력이지만, 입력해주시면 더 나은 결과가 나와요 😊</p>
            <label style={{ display: 'block', marginBottom: '1rem' }}>
                나의 의견:
                <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="예: 스트레칭"
                    style={{ marginLeft: '0.5rem', width: '80%' }}
                />
            </label>
            <button onClick={handleGenerate} disabled={loading}>
                {loading ? '생성 중...' : '✨ AI 루틴 생성하기'}
            </button>

        </SurveyModal>
    );
};

export default RoutineOpinionPage;
