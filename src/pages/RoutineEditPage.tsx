import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SurveyModal from '../components/SurveyModal';
// import axios from 'axios';


interface RoutineItem {
    text: string;
    isEditing: boolean;
    color: string;
    emoji: string;
    daysOfWeek: string[];
    group: string;
}

const RoutineCustomizePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialRoutines = (location.state?.selectedRoutines || []) as RoutineItem[];

    const [routines, setRoutines] = useState<RoutineItem[]>(initialRoutines);
    const [customGroups, setCustomGroups] = useState<string[]>([]);
    const [modalOpen, setModalOpen] = useState(true);

    const updateRoutine = (idx: number, updated: Partial<RoutineItem>) => {
        const newRoutines = [...routines];
        newRoutines[idx] = { ...newRoutines[idx], ...updated };
        setRoutines(newRoutines);
    };

    const handleSubmit = async () => {

        console.log('📦 저장할 루틴 목록:', routines);

        // ✅ 저장 성공 시뮬레이션 (1초 후 /main 이동)
        setTimeout(() => {
            console.log('✅ 루틴 저장 완료됨 (모의)');
            navigate('/main');
        }, 1000);
       /* const guestId = localStorage.getItem('guest_id');
        if (!guestId) {
            alert('게스트 ID 없음');
            return;
        }

        try {
           await axios.post('/routines', routines, {
                headers: {
                    'X-Guest-Id': guestId,
                    'Content-Type': 'application/json'
                }
            });
            navigate('/main');
        } catch (err) {
            console.error('❌ 루틴 저장 실패:', err);
            alert('저장 실패! 나중에 다시 시도해 주세요.');
        }*/
    };


    return (
        <SurveyModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onNext={handleSubmit}
            showNext={false}
        >
            <h2>🎨 선택한 루틴 꾸미기</h2>
            <p>루틴의 이름, 색상, 이모지, 요일, 그룹을 자유롭게 설정하세요!</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem',maxHeight:'400px', overflowY: 'auto',paddingRight: '0.5rem' }}>
                {routines.map((routine, idx) => (
                    <div
                        key={idx}
                        style={{
                            padding: '1.5rem',
                            background: '#fefefe',
                            border: '1px solid #ddd',
                            borderRadius: '12px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                        }}
                    >
                        {/* 루틴 이름 수정 */}
                        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
                            <strong>루틴 이름:</strong>
                            <input
                                type="text"
                                value={routine.text}
                                onChange={(e) => updateRoutine(idx, { text: e.target.value })}
                                style={{ marginLeft: '0.5rem', width: '80%' }}
                            />
                        </label>

                        <label style={{ display: 'block', marginTop: '1rem' }}>
                            <strong>색상 선택:</strong>
                            <input
                                type="color"
                                value={routine.color}
                                onChange={(e) => updateRoutine(idx, { color: e.target.value })}
                                style={{ marginLeft: '0.5rem' }}
                            />
                        </label>

                        <label style={{ display: 'block', marginTop: '1rem' }}>
                            <strong>이모지:</strong>
                            <input
                                type="text"
                                value={routine.emoji}
                                onChange={(e) => updateRoutine(idx, { emoji: e.target.value })}
                                placeholder="🌱 💪 🧘"
                                style={{ marginLeft: '0.5rem' }}
                                size={10}
                            />
                        </label>

                        <label style={{ display: 'block', marginTop: '1rem' }}>
                            <strong>요일 선택:</strong>
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                                <label key={day} style={{ marginRight: '1rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={routine.daysOfWeek.includes(day)}
                                        onChange={(e) => {
                                            const newDays = e.target.checked
                                                ? [...routine.daysOfWeek, day]
                                                : routine.daysOfWeek.filter((d) => d !== day);
                                            updateRoutine(idx, { daysOfWeek: newDays });
                                        }}
                                    />{' '}
                                    {day}
                                </label>
                            ))}
                        </div>

                        <label style={{ display: 'block', marginTop: '1rem' }}>
                            <strong>그룹 선택:</strong>
                        </label>
                        <select
                            value={routine.group}
                            onChange={(e) => updateRoutine(idx, { group: e.target.value })}
                            style={{ marginTop: '0.5rem' }}
                        >
                            <option value="기본">기본</option>
                            {customGroups.map((group) => (
                                <option key={group} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>

                        <div style={{ marginTop: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder="새 그룹 추가"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const newGroup = e.currentTarget.value.trim();
                                        if (newGroup && !customGroups.includes(newGroup)) {
                                            setCustomGroups([...customGroups, newGroup]);
                                            updateRoutine(idx, { group: newGroup });
                                            e.currentTarget.value = '';
                                        }
                                    }
                                }}
                            />{' '}
                            <small>Enter로 그룹 추가</small>
                        </div>
                    </div>
                ))}
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button
                        onClick={handleSubmit}
                        style={{
                            backgroundColor: '#6C63FF',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        🎉 설정 완료 및 저장하기
                    </button>
                </div>
            </div>
        </SurveyModal>
    );
};

export default RoutineCustomizePage;
