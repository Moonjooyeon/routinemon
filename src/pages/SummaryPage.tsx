import { useState } from 'react';
import { useSurvey } from '../content/SurveyContext';
import { useNavigate } from 'react-router-dom';
import { generateRoutinePrompt } from '../utils/promptGen';
import { chatWithGPT } from '../utils/chatWithGPT';
import { prettySurveySummary } from '../utils/prettySurvey';
import { getGuestId } from '../utils/guest';
import axios from 'axios';

interface RoutineSettings {
    recurrenceType: string;
    daysOfWeek: string[];
    timesPerWeek: number;
    startDate: string;
    endDate: string;
    executionTime: string;
    color: string;
    showInHeatmap: boolean;
    emoji: string;
}

interface RoutineItem {
    text: string;
    isEditing: boolean;
}

const SummaryPage = () => {
    const { survey } = useSurvey();
    const navigate = useNavigate();
    const guestId = getGuestId();

    const [loading, setLoading] = useState(false);
    const [rawResult, setRawResult] = useState('');
    const [routines, setRoutines] = useState<string[]>([]);
    const [selectedRoutines, setSelectedRoutines] = useState<RoutineItem[]>([]);
    const [confirmed, setConfirmed] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [routineSettings, setRoutineSettings] = useState<RoutineSettings>({
        recurrenceType: 'daily',
        daysOfWeek: [],
        timesPerWeek: 3,
        startDate: '',
        endDate: '',
        executionTime: '',
        color: '#FFB6C1',
        showInHeatmap: true,
        emoji: '',
    });

    const submitUserSurveyToBackend = async () => {
        const entries = [
            { question_type: 'goals', answer: survey.goals.join(', ') },
            { question_type: 'preferred_time', answer: survey.timeZone },
            { question_type: 'time_per_routine', answer: survey.timePerRoutine },
            { question_type: 'feedback_style', answer: survey.feedbackStyle },
            { question_type: 'personality', answer: survey.personality },
            { question_type: 'self_state', answer: survey.selfState },
            { question_type: 'emotions', answer: survey.emotions.join(', ') },
            { question_type: 'obstacle', answer: survey.obstacle },
            { question_type: 'partner_type', answer: survey.partnerType },
        ];

        for (const entry of entries) {
            await axios.post('http://localhost:8080/user-survey-answers', {
                guest_id: guestId,
                question_type: entry.question_type,
                answer: entry.answer,
            });
        }
    };

    const submitFinalRoutineToBackend = async () => {
        for (const routine of selectedRoutines) {
            await axios.post('http://localhost:8080/routines', {
                guest_id: guestId,
                title: routine.text,
                recurrence_type: routineSettings.recurrenceType,
                days_of_week: routineSettings.daysOfWeek,
                times_per_week: routineSettings.timesPerWeek,
                start_date: routineSettings.startDate,
                end_date: routineSettings.endDate,
                execution_times: survey.execution_times,
                color: routineSettings.color,
                show_in_heatmap: routineSettings.showInHeatmap,
                emoji: routineSettings.emoji,
            });
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setRawResult('');
        setRoutines([]);
        setSelectedRoutines([]);
        setConfirmed(false);
        setShowSettings(false);

        // 백엔드 저장 실패해도 GPT는 계속 실행
        try {
            await submitUserSurveyToBackend();
        } catch (err) {
            console.warn('⚠️ 설문 응답 저장 실패 (백엔드 꺼져있을 수 있음)', err);
        }

        const prompt = generateRoutinePrompt(survey);

        try {
            const response = await chatWithGPT(prompt);
            setRawResult(response);

            const parsed = response
                .split(/\n\d+\.\s/)
                .filter(r => r.trim() !== '')
                .map(r => r.trim());

            setRoutines(parsed);
        } catch (err) {
            console.error('❌ GPT 호출 실패:', err);
            setRawResult('오류가 발생했어요. 다시 시도해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if (selectedRoutines.length === 0) {
            alert('루틴을 최소 1개 이상 선택해주세요!');
            return;
        }
        setShowSettings(true);
    };

    const handleFinalSubmit = async () => {
        if (
            routineSettings.recurrenceType === 'weekly' &&
            routineSettings.daysOfWeek.length === 0
        ) {
            alert('요일을 최소 1개 이상 선택해주세요.');
            return;
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

            <button onClick={handleGenerate} disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? '생성 중...' : '✨ AI 루틴 생성하기'}
            </button>

            {rawResult && routines.length === 0 && (
                <div style={{ marginTop: '2rem', background: '#fff6f6', padding: '1rem' }}>
                    <h3>⚠️ GPT 응답</h3>
                    <pre>{rawResult}</pre>
                </div>
            )}

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
                                        : [...selectedRoutines, { text: routine, isEditing: false }]
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
                            <strong>{idx + 1}.</strong> {routine}
                        </button>
                    ))}
                </div>
            )}

            {selectedRoutines.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>✅ 선택한 루틴 목록</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {selectedRoutines.map((routineItem, idx) => (
                            <li
                                key={idx}
                                style={{
                                    marginBottom: '1rem',
                                    backgroundColor: '#f4f4f4',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                }}
                            >
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
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginTop: '1rem' }}>
                        <button onClick={handleConfirm}>✅ 이 루틴들로 진행하기</button>
                    </div>
                </div>
            )}

            {showSettings && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>🔧 루틴 설정</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <label>루틴 색상 선택:</label>
                        <input
                            type="color"
                            value={routineSettings.color}
                            onChange={(e) =>
                                setRoutineSettings({ ...routineSettings, color: e.target.value })
                            }
                            style={{ marginLeft: '0.5rem' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label>루틴 이모지:</label>
                        <input
                            type="text"
                            value={routineSettings.emoji}
                            onChange={(e) =>
                                setRoutineSettings({ ...routineSettings, emoji: e.target.value })
                            }
                            placeholder="이모지를 넣으면 더 귀여워요! "
                            style={{ marginLeft: '0.5rem' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label>루틴 주기:</label>
                        <select
                            value={routineSettings.recurrenceType}
                            onChange={(e) =>
                                setRoutineSettings({ ...routineSettings, recurrenceType: e.target.value })
                            }
                            style={{ marginLeft: '0.5rem' }}
                        >
                            <option value="daily">매일</option>
                            <option value="weekly">특정 요일</option>
                            <option value="nTimesPerWeek">주 N회</option>
                        </select>
                    </div>

                    {routineSettings.recurrenceType === 'weekly' && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label>루틴 요일 선택:</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                                    <label key={day}>
                                        <input
                                            type="checkbox"
                                            value={day}
                                            checked={routineSettings.daysOfWeek.includes(day)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setRoutineSettings({
                                                        ...routineSettings,
                                                        daysOfWeek: [...routineSettings.daysOfWeek, day],
                                                    });
                                                } else {
                                                    setRoutineSettings({
                                                        ...routineSettings,
                                                        daysOfWeek: routineSettings.daysOfWeek.filter((d) => d !== day),
                                                    });
                                                }
                                            }}
                                            style={{ marginLeft: '0.5rem', marginRight: '0.25rem' }}
                                        />
                                        {day}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}


                    {routineSettings.recurrenceType === 'nTimesPerWeek' && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label>주 몇 회:</label>
                            <input
                                type="number"
                                value={routineSettings.timesPerWeek}
                                onChange={(e) =>
                                    setRoutineSettings({
                                        ...routineSettings,
                                        timesPerWeek: parseInt(e.target.value),
                                    })
                                }
                                style={{ marginLeft: '0.5rem', width: '60px' }}
                            />
                        </div>
                    )}

                    <button
                        onClick={handleFinalSubmit}
                        disabled={
                            routineSettings.recurrenceType === 'weekly' &&
                            routineSettings.daysOfWeek.length === 0
                        }
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
