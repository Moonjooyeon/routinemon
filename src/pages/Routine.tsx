import { useState, useEffect } from 'react';
import axios from 'axios';
import { getRoutineSuggestions } from '../gptApi';

const Routine = () => {
    const [goal, setGoal] = useState('');
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [routine, setRoutine] = useState<string | null>(null);
    const [history, setHistory] = useState<{ goal: string; routine: string }[]>([]);

    // 처음 마운트될 때 localStorage에서 히스토리 불러오기
    useEffect(() => {
        const saved = localStorage.getItem('routineHistory');
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, []);

    // 쿨다운 타이머
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setInterval(() => {
                setCooldown(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [cooldown]);

    const handleClick = async () => {
        if (loading || cooldown > 0 || goal.trim() === '') return;

        setLoading(true);
        try {
            const response: string = await getRoutineSuggestions(goal);
            setRoutine(response);

            const newRecord = { goal, routine: response };
            const newHistory = [newRecord, ...history.slice(0, 9)]; // 최대 10개 유지
            setHistory(newHistory);
            localStorage.setItem('routineHistory', JSON.stringify(newHistory));
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 429) {
                alert("요청이 너무 많습니다. 10초 후 다시 시도해주세요.");
                setCooldown(10);
            } else {
                console.error("❌ 에러 발생:", err);
                alert("문제가 발생했습니다. 콘솔을 확인해주세요.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>🎯 당신의 목표는 무엇인가요?</h2>
            <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="예: 운동하기, 공부 열심히 하기"
                style={{ padding: '0.5rem', width: '80%', marginBottom: '1rem' }}
            />
            <br />
            <button onClick={handleClick} disabled={loading || cooldown > 0 || goal.trim() === ''}>
                {loading
                    ? '생성 중...'
                    : cooldown > 0
                        ? `잠시만요... (${cooldown}s)`
                        : '루틴 생성하기'}
            </button>

            {routine && (
                <div style={{ marginTop: '1.5rem', whiteSpace: 'pre-line' }}>
                    <h3>🌟 추천 루틴:</h3>
                    <p>{routine}</p>
                </div>
            )}

            {history.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>📜 이전에 만든 루틴</h3>
                    <ul>
                        {history.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '1rem' }}>
                                <strong>목표:</strong> {item.goal}
                                <br />
                                <span style={{ whiteSpace: 'pre-line' }}>{item.routine}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Routine;
