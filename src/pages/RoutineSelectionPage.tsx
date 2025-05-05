import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SurveyModal from '../components/SurveyModal';

interface RoutineItem {
    text: string;
    isEditing: boolean;
    color: string;
    emoji: string;
    daysOfWeek: string[];
    group: string;
}

const RoutineSelectionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedRoutines, setSelectedRoutines] = useState<RoutineItem[]>([]);
    const [modalOpen, setModalOpen] = useState(true);
    const generatedRoutines: RoutineItem[] = location.state?.generatedRoutines || [];

    useEffect(() => {
        console.log('📦 전달된 루틴 목록:', generatedRoutines);
    }, [generatedRoutines]);

    const toggleSelect = (routine: RoutineItem) => {
        const exists = selectedRoutines.some((r) => r.text === routine.text);
        if (exists) {
            setSelectedRoutines(selectedRoutines.filter((r) => r.text !== routine.text));
        } else {
            setSelectedRoutines([...selectedRoutines, routine]);
        }
    };

    const goToCustomize = () => {
        if (selectedRoutines.length === 0) {
            alert('루틴을 1개 이상 선택해주세요!');
            return;
        }
        navigate('/routine-customize', { state: { selectedRoutines } });
    };

    return (
        <SurveyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onNext={goToCustomize}>
            <h2>📌 AI가 제안한 루틴</h2>
            <p>마음에 드는 루틴을 골라 다음 단계에서 꾸며주세요!</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                {generatedRoutines.length === 0 ? (
                    <p>⏳ AI 루틴 결과가 전달되지 않았어요. 다시 시도해 주세요.</p>
                ) : (
                    generatedRoutines.map((routine, idx) => {
                        return (
                            <button
                                key={idx}
                                onClick={() => toggleSelect(routine)}
                                style={{
                                    textAlign: 'left',
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    border: selectedRoutines.some(r => r.text === routine.text)
                                        ? '2px solid #007bff'
                                        : '1px solid #ccc',
                                    backgroundColor: selectedRoutines.some(r => r.text === routine.text)
                                        ? '#eef6ff'
                                        : '#fff',
                                    cursor: 'pointer',
                                    color: '#333',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                <strong>{idx + 1}.</strong> {routine.text}
                            </button>
                        );
                    })
                )}
            </div>
        </SurveyModal>
    );
};

export default RoutineSelectionPage;
