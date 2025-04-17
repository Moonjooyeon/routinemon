import { useState } from 'react';
import { chatWithGPT } from '../utils/chatWithGPT';
import { useSurvey } from '../content/SurveyContext';

const RoutineStartPage = () => {
    const [goal, setGoal] = useState('');
    const [keywords, setKeywords] = useState('');
    const [routines, setRoutines] = useState<string[]>([]);
    const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);
    const [editedRoutine, setEditedRoutine] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const { survey } = useSurvey();

    const handleGenerate = async () => {
        setLoading(true);
        setRoutines([]);
        setSelectedRoutine(null);
        setEditedRoutine('');
        setConfirmed(false);
        try {
            const prompt = `당신은 루틴 코치입니다. 사용자의 목표는 "${goal}"이며, 연관된 키워드는 "${keywords}"입니다.

추가 사용자 정보는 다음과 같습니다:
- 성격 유형: ${survey.personality}
- 피드백 스타일: ${survey.feedbackStyle}
- 감정 상태: ${survey.selfState}
- 캐릭터 파트너 유형: ${survey.partnerType}

💬 말투 스타일 가이드:
사용자의 피드백 스타일과 캐릭터 파트너 유형을 반영해 말투를 조정해주세요.
예:
- 스타일이 '위로'이고 캐릭터가 '동물형'이면: "~냥", "쓰담쓰담~" 같은 말투
- '식물형'은 담백하고 조용한 말투
- '마법형'은 마법적 표현과 시적 비유 사용
- '랜덤형'은 유머와 예측 불가한 스타일 허용

사용자가 하루 5~10분 정도 집중할 수 있다고 가정하고, 다음 조건에 맞춰 루틴 4개를 추천해 주세요:

- 단순한 동작보다 의미 있는 내면 반응을 이끌어내는 행동
- 단계형 구조 (예: 1단계: 눈 감기 → 2단계: 감정 적기)
- 감정적 몰입 또는 자기 인식 유도
- 콘셉트 제목 + 설명 + 구체적인 행동 문장 포함
- 이미 흔하게 접하는 루틴(ex. 물 마시기, 심호흡 3회)은 제외
- 행동은 딱 1줄로 눈에 들어오기.

루틴은 아래와 같은 형식으로 4개 제시해주세요:

1. 📘 루틴 제목
- 목표: 
- 행동:`;

            const response = await chatWithGPT(prompt);
            const parsed = response
                .split(/\n\d+\.\s/) // 숫자+점으로 시작하는 루틴 분리
                .filter(r => r.trim() !== '')
                .map(r => r.trim());

            setRoutines(parsed);
        } catch (err) {
            console.error(err);
            setRoutines(['루틴 생성 중 오류가 발생했습니다.']);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        setConfirmed(true);
    };

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem' }}>
            <h2>🎯 나만의 루틴 만들기</h2>

            <input
                type="text"
                placeholder="목표를 입력하세요 (예: 감정 일기 습관 만들기)"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
            <input
                type="text"
                placeholder="관련 키워드를 입력하세요 (예: 스트레스, 감정, 메모)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
            <button onClick={handleGenerate} disabled={loading} style={{ marginBottom: '1rem' }}>
                {loading ? '생성 중...' : '루틴 생성하기'}
            </button>

            <div style={{ marginTop: '2rem' }}>
                {routines.map((routine, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setSelectedRoutine(routine);
                            setEditedRoutine(routine);
                            setIsEditing(false);
                            setConfirmed(false);
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
                                <button onClick={() => { setIsEditing(false); }} style={{ marginTop: '0.5rem' }}>
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
                                    <button onClick={handleConfirm}>
                                        ✅ 이대로 진행하기
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {confirmed && (
                    <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e0ffe0', borderRadius: '8px' }}>
                        <strong>🎉 선택된 루틴이 확정되었습니다!</strong>
                        <p style={{ marginTop: '0.5rem' }}>{editedRoutine}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoutineStartPage;
