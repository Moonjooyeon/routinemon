import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getGuestId } from '../utils/guest';
import { chatWithGPT } from '../utils/chatWithGPT';

const RoutineEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const guestId = getGuestId();

    const [routine, setRoutine] = useState({
        title: '',
        recurrence_type: 'daily',
        execution_time: '',
    });
    const [aiSuggestion, setAiSuggestion] = useState('');

    useEffect(() => {
        const fetchRoutine = async () => {
            const res = await axios.get(`https://your-backend-url.com/routines/${id}?guest_id=${guestId}`);
            setRoutine(res.data);
        };
        fetchRoutine();
    }, [id, guestId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRoutine((prev) => ({ ...prev, [name]: value }));
    };


    const handleAISuggestion = async () => {
        const prompt = `루틴 수정 제안: ${routine.title}\n실행 시간: ${routine.execution_time}`;
        const suggestion = await chatWithGPT(prompt);
        setAiSuggestion(suggestion);
    };

    const handleSave = async () => {
        try {
            await axios.put(`https://your-backend-url.com/routines/${id}`, {
                guest_id: guestId,
                ...routine,
            });
            alert('루틴이 저장되었습니다.');
            navigate('/routines');
        } catch (err) {
            console.error('❌ 저장 실패', err);
            alert('저장 중 오류 발생');
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">루틴 수정</h2>
            <label className="block mb-2">루틴 내용:</label>
            <textarea
                name="title"
                value={routine.title}
                onChange={handleChange}
                rows={4}
                className="w-full border p-2 rounded mb-4"
            />

            <label className="block mb-2">실행 시간:</label>
            <select
                name="execution_time"
                value={routine.execution_time}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-4"
            >
                <option value="">선택 안 함</option>
                <option value="08:00">오전 8시</option>
                <option value="22:00">밤 10시</option>
                <option value="기상 직후">기상 직후</option>
                <option value="잠들기 전">잠들기 전</option>
            </select>

            <button onClick={handleAISuggestion} className="bg-purple-500 text-white px-4 py-2 rounded mr-2">
                🤖 AI 추천 받기
            </button>
            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                💾 저장
            </button>

            {aiSuggestion && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h4 className="font-bold mb-2">AI 제안:</h4>
                    <p>{aiSuggestion}</p>
                </div>
            )}
        </div>
    );
};

export default RoutineEditPage;