import { useState } from 'react';
import { useSurvey } from '../content/SurveyContext';
import { useNavigate } from 'react-router-dom';
import { generateRoutinePrompt } from '../utils/promptGen';
import { chatWithGPT } from '../utils/chatWithGPT';
import { prettySurveySummary } from '../utils/prettySurvey';
import { getGuestId } from '../utils/guest';
import axios from 'axios';

interface RoutineItem {
    text: string;
    isEditing: boolean;
    color: string;
    emoji: string;
    daysOfWeek: string[];
    group?: string;
}

const SummaryPage = () => {
    const { survey } = useSurvey();
    const navigate = useNavigate();
    const guestId = getGuestId();
    const [customGroups, setCustomGroups] = useState<string[]>([]);

    const [customInput, setCustomInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [routines, setRoutines] = useState<string[]>([]);
    const [selectedRoutines, setSelectedRoutines] = useState<RoutineItem[]>([]);
    const [confirmed, setConfirmed] = useState(false);

    const submitFinalRoutineToBackend = async () => {
        for (const routine of selectedRoutines) {
            await axios.post('http://localhost:8080/routines', {
                guest_id: guestId,
                title: routine.text,
                recurrence_type: 'weekly',
                days_of_week: routine.daysOfWeek,
                times_per_week: 0,
                start_date: '',
                end_date: '',
                execution_times: survey.execution_times,
                color: routine.color,
                show_in_heatmap: true,
                emoji: routine.emoji,
            });
        }
    };

   /* const submitUserSurveyToBackend = async () => {
        const entries = [
            { question_type: 'goals', answer: survey.goals?.join(', ') },
            { question_type: 'preferred_time', answer: survey.timeZone },
            { question_type: 'time_per_routine', answer: survey.timePerRoutine },
            { question_type: 'feedback_style', answer: survey.feedbackStyle },
            { question_type: 'self_state', answer: survey.selfState },
            { question_type: 'personality', answer: survey.personality },
            { question_type: 'emotions', answer: survey.emotions?.join(', ') || '' },
            { question_type: 'obstacle', answer: survey.obstacle },
        ];

        for (const entry of entries) {
            if (entry.answer) {
                await axios.post('http://localhost:8080/user-survey-answers', {
                    guest_id: guestId,
                    question_type: entry.question_type,
                    answer: entry.answer,
                });
            }
        }
    };*/

    const handleGenerate = async () => {
        setLoading(true);
        setRoutines([]);
        setSelectedRoutines([]);
        setConfirmed(false);

        try {
           // await submitUserSurveyToBackend();
            const prompt = generateRoutinePrompt(survey, customInput);
            const response = await chatWithGPT(prompt);

            const parsed = response
                .split(/\n\d+\.\s/)
                .filter(r => r.trim() !== '')
                .map(r => r.trim().replace(/^\d+\.\s*/, ''));

            setRoutines(parsed);
        } catch (err) {
            console.error('❌ GPT 호출 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalSubmit = async () => {
        if (selectedRoutines.length === 0) {
            alert('루틴을 최소 1개 이상 선택해주세요!');
            return;
        }

        for (const routine of selectedRoutines) {
            if (routine.daysOfWeek.length === 0) {
                alert('루틴 요일을 지정해 주세요!');
                return;
            }
        }

        await submitFinalRoutineToBackend();
        setConfirmed(true);
        navigate('/routines');
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
            <h2>📝 당신의 루틴 설문 요약</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {prettySurveySummary(survey).map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>
                        <strong>{item.label}:</strong> {item.value}
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: '2rem' }}>
                <label>
                    나의 의견을 말해보세요!:
                    <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="예: 스트레칭하고 마음 다잡기"
                        style={{ marginLeft: '0.5rem', width: '60%' }}
                    />
                </label>
            </div>

            <button onClick={handleGenerate} disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? '생성 중...' : '✨ AI 루틴 생성하기'}
            </button>

            {routines.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>✨ 루틴 제안 결과</h3>
                    {routines.map((routine, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                const already = selectedRoutines.some(r => r.text === routine);
                                setSelectedRoutines(
                                    already
                                        ? selectedRoutines.filter(r => r.text !== routine)
                                        : [...selectedRoutines, { text: routine, isEditing: false, color: '#FFB6C1', emoji: '', daysOfWeek: [], group: '기본' }]
                                );
                            }}
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                marginBottom: '1rem',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: selectedRoutines.some(r => r.text === routine)
                                    ? '2px solid #007bff'
                                    : '1px solid #ccc',
                                backgroundColor: selectedRoutines.some(r => r.text === routine)
                                    ? '#eef6ff'
                                    : '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            <strong>{idx +1}.</strong> {routine}
                        </button>
                    ))}
                </div>
            )}

            {selectedRoutines.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>✅ 선택한 루틴별 설정</h3>
                    {selectedRoutines.map((routineItem, idx) => (
                        <div key={idx} style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
                            {routineItem.isEditing ? (
                                <>
                                    <textarea
                                        value={routineItem.text}
                                        onChange={(e) => {
                                            const updated = [...selectedRoutines];
                                            updated[idx].text = e.target.value;
                                            setSelectedRoutines(updated);
                                        }}
                                        rows={3}
                                        style={{ width: '100%', marginBottom: '0.5rem' }}
                                    />
                                    <button onClick={() => {
                                        const updated = [...selectedRoutines];
                                        updated[idx].isEditing = false;
                                        setSelectedRoutines(updated);
                                    }}>
                                        수정 완료
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div style={{ marginBottom: '0.5rem' }}>{idx + 1}. {routineItem.text}</div>
                                    <button onClick={() => {
                                        const updated = [...selectedRoutines];
                                        updated[idx].isEditing = true;
                                        setSelectedRoutines(updated);
                                    }}>
                                        ✏️ 수정하기
                                    </button>
                                </>
                            )}

                            {/* 색상 선택 */}
                            <div style={{ marginTop: '1rem' }}>
                                <label>색상:</label>
                                <input
                                    type="color"
                                    value={routineItem.color}
                                    onChange={(e) => {
                                        const updated = [...selectedRoutines];
                                        updated[idx].color = e.target.value;
                                        setSelectedRoutines(updated);
                                    }}
                                    style={{ marginLeft: '0.5rem' }}
                                />
                            </div>

                            {/* 이모지 입력 */}
                            <div style={{ marginTop: '1rem' }}>
                                <label>이모지:</label>
                                <input
                                    type="text"
                                    value={routineItem.emoji}
                                    onChange={(e) => {
                                        const updated = [...selectedRoutines];
                                        updated[idx].emoji = e.target.value;
                                        setSelectedRoutines(updated);
                                    }}
                                    placeholder="🌱 💪 🧘"
                                    style={{ marginLeft: '0.5rem' }}
                                    size={20}
                                />
                            </div>

                            {/* 요일 선택 */}
                            <div style={{ marginTop: '1rem' }}>
                                <label>요일 선택:</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                                        <label key={day}>
                                            <input
                                                type="checkbox"
                                                checked={routineItem.daysOfWeek.includes(day)}
                                                onChange={(e) => {
                                                    const updated = [...selectedRoutines];
                                                    if (e.target.checked) {
                                                        updated[idx].daysOfWeek.push(day);
                                                    } else {
                                                        updated[idx].daysOfWeek = updated[idx].daysOfWeek.filter((d) => d !== day);
                                                    }
                                                    setSelectedRoutines(updated);
                                                }}
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>

                                {/* 그룹 선택 */}
                                <div style={{ marginTop: '1rem' }}>
                                    <label>그룹 선택:</label>
                                    <select
                                        value={routineItem.group}
                                        onChange={(e) => {
                                            const updated = [...selectedRoutines];
                                            updated[idx].group = e.target.value;
                                            setSelectedRoutines(updated);
                                        }}
                                        style={{ marginLeft: '0.5rem' }}
                                    >
                                        {/* 기존 그룹 목록 렌더링 */}
                                        <option value="기본">기본</option>
                                        {customGroups.map((group) => (
                                            <option key={group} value={group}>{group}</option>
                                        ))}
                                    </select>

                                    {/* 새 그룹 추가 */}
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <input
                                            type="text"
                                            placeholder="새 그룹명 입력"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const newGroup = e.currentTarget.value.trim();
                                                    if (newGroup && !customGroups.includes(newGroup)) {
                                                        setCustomGroups([...customGroups, newGroup]);
                                                        const updated = [...selectedRoutines];
                                                        updated[idx].group = newGroup;
                                                        setSelectedRoutines(updated);
                                                        e.currentTarget.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        <small style={{ marginLeft: '0.5rem' }}>Enter로 그룹 추가</small>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleFinalSubmit}
                        style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            width: '100%',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        🎉 설정 완료 & 저장하기
                    </button>
                </div>
            )}

            {confirmed && (
                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e0ffe0', borderRadius: '8px' }}>
                    <strong>🎉 선택된 루틴이 확정되었습니다!</strong>
                    <button onClick={() => navigate('/')}>🏠 처음부터 다시하기</button>
                </div>
            )}
        </div>
    );
};

export default SummaryPage;
