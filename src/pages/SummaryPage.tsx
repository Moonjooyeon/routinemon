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




const SummaryPage = () => {
    const { survey } = useSurvey();
    const [loading, setLoading] = useState(false);
    const [rawResult, setRawResult] = useState('');
    const [routines, setRoutines] = useState<string[]>([]);
    const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);
    const [editedRoutine, setEditedRoutine] = useState('');
    const [isEditing, setIsEditing] = useState(false);
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

    const navigate = useNavigate();
    const guestId = getGuestId();

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

        try {
            for (const entry of entries) {
                await axios.post('http://localhost:8080/user-survey-answers', {
                    guest_id: guestId,
                    question_type: entry.question_type,
                    answer: entry.answer,
                });
            }
            console.log('✅ 설문 응답 전송 완료');
        } catch (err) {
            console.error('❌ 설문 응답 전송 실패:', err);
        }
    };

    const submitFinalRoutineToBackend = async () => {
        try {
            await axios.post('http://localhost:8080/routines', {
                guest_id: guestId,
                title: editedRoutine,
                recurrence_type: routineSettings.recurrenceType,
                days_of_week: routineSettings.daysOfWeek,
                times_per_week: routineSettings.timesPerWeek,
                start_date: routineSettings.startDate,
                end_date: routineSettings.endDate,
                execution_time: routineSettings.executionTime,
            });
            console.log('✅ 루틴 저장 완료');
        } catch (err) {
            console.error('❌ 루틴 저장 실패:', err);
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        setRawResult('');
        setRoutines([]);
        setSelectedRoutine(null);
        setEditedRoutine('');
        setConfirmed(false);
        setShowSettings(false);

        await submitUserSurveyToBackend();

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
            console.error(err);
            setRawResult('오류가 발생했어요. 다시 시도해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        setShowSettings(true);
    };

    const handleFinalSubmit = async () => {
        setConfirmed(true);
        await submitFinalRoutineToBackend();
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
                                setSelectedRoutine(routine);
                                setEditedRoutine(routine);
                                setIsEditing(false);
                                setConfirmed(false);
                                setShowSettings(false);
                            }}
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                marginBottom: '1rem',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: selectedRoutine === routine ? '2px solid #007bff' : '1px solid #ccc',
                                backgroundColor: selectedRoutine === routine ? '#eef6ff' : '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            <strong>{idx + 1}.</strong> {routine}
                        </button>
                    ))}

                    <button onClick={handleGenerate} disabled={loading} style={{ marginTop: '1rem' }}>
                        🔄 루틴 다시 생성하기
                    </button>
                </div>
            )}

            {selectedRoutine && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>✅ 선택한 루틴</h3>
                    {isEditing ? (
                        <>
                            <textarea
                                value={editedRoutine}
                                onChange={(e) => setEditedRoutine(e.target.value)}
                                rows={6}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px' }}
                            />
                            <button onClick={() => setIsEditing(false)} style={{ marginTop: '0.5rem' }}>
                                수정 완료
                            </button>
                        </>
                    ) : (
                        <>
                            <pre style={{ whiteSpace: 'pre-wrap', padding: '1rem', background: '#f4f4f4', borderRadius: '8px' }}>
                                {editedRoutine}
                            </pre>
                            <div style={{ marginTop: '0.5rem' }}>
                                <button onClick={() => setIsEditing(true)} style={{ marginRight: '1rem' }}>
                                    ✏️ 수정하기
                                </button>
                                <button onClick={handleConfirm}>✅ 이 루틴으로 진행하기</button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {showSettings && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>🔧 루틴 설정</h3>
                    <div>
                        <label>루틴 색상 선택:</label>
                        <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                            {["#FFB6C1", "#FFD700", "#90EE90", "#87CEEB", "#9370DB", "#FF7F50", "#F08080", "#40E0D0"].map((color) => (
                                <div
                                    key={color}
                                    onClick={() => setRoutineSettings({ ...routineSettings, color })}
                                    style={{ width: 30, height: 30, backgroundColor: color, borderRadius: '50%', border: routineSettings.color === color ? '3px solid black' : '1px solid #ccc', cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    </div>

                    //히트맵 표시 여부
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={routineSettings.showInHeatmap}
                                onChange={(e) => setRoutineSettings({ ...routineSettings, showInHeatmap: e.target.checked })}
                            />{' '}
                            히트맵에 표시할래요
                        </label>
                    </div>

                    // 아이콘/이모지 설정
                    <div>
                        <label>루틴 아이콘 (이모지 선택):</label>
                        <input
                            type="text"
                            value={routineSettings.emoji}
                            onChange={(e) => setRoutineSettings({ ...routineSettings, emoji: e.target.value })}
                            placeholder="예: 🌱 💪 🧘"
                            style={{ width: '100px', marginLeft: '0.5rem' }}
                        />
                    </div>

                    <label>주기 설정:
                        <select value={routineSettings.recurrenceType} onChange={(e) => setRoutineSettings({ ...routineSettings, recurrenceType: e.target.value })}>
                            <option value="daily">매일</option>
                            <option value="weekly">특정 요일</option>
                            <option value="nTimesPerWeek">주 N회</option>
                        </select>
                    </label>
                    {routineSettings.recurrenceType === 'weekly' && (
                        <div>
                            {["월", "화", "수", "목", "금", "토", "일"].map(day => (
                                <label key={day} style={{ marginRight: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={routineSettings.daysOfWeek.includes(day)}
                                        onChange={(e) => {
                                            const days = [...routineSettings.daysOfWeek];
                                            if (e.target.checked) days.push(day);
                                            else days.splice(days.indexOf(day), 1);
                                            setRoutineSettings({ ...routineSettings, daysOfWeek: days });
                                        }}
                                    /> {day}
                                </label>
                            ))}
                        </div>
                    )}
                    {routineSettings.recurrenceType === 'nTimesPerWeek' && (
                        <div>
                            주 몇 회:
                            <input type="number" value={routineSettings.timesPerWeek} onChange={(e) => setRoutineSettings({ ...routineSettings, timesPerWeek: parseInt(e.target.value) })} />
                        </div>
                    )}

                    <div>
                        <label>시작일: <input type="date" value={routineSettings.startDate} onChange={(e) => setRoutineSettings({ ...routineSettings, startDate: e.target.value })} /></label>
                        <label>종료일: <input type="date" value={routineSettings.endDate} onChange={(e) => setRoutineSettings({ ...routineSettings, endDate: e.target.value })} /></label>
                    </div>
                    <div>
                        <label>실행 시간:
                            <select value={routineSettings.executionTime} onChange={(e) => setRoutineSettings({ ...routineSettings, executionTime: e.target.value })}>
                                <option value="">선택 안 함</option>
                                <option value="08:00">오전 8시</option>
                                <option value="22:00">밤 10시</option>
                                <option value="기상 직후">기상 직후</option>
                                <option value="잠들기 전">잠들기 전</option>
                            </select>
                        </label>
                    </div>

                    <button onClick={handleFinalSubmit} style={{ marginTop: '1rem' }}>🎉 설정 완료 & 저장하기</button>
                </div>
            )}

            {confirmed && (
                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e0ffe0', borderRadius: '8px' }}>
                    <strong>🎉 선택된 루틴이 확정되었습니다!</strong>
                    <p style={{ marginTop: '0.5rem' }}>{editedRoutine}</p>
                    <button onClick={() => navigate('/')}>🏠 처음부터 다시하기</button>
                </div>
            )}
        </div>
    );
};

export default SummaryPage;