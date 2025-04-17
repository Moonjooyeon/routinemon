import { useEffect, useState } from 'react';
import axios from 'axios';
import { getGuestId } from '../utils/guest';
import { useNavigate } from 'react-router-dom';

interface Routine {
    id: number;
    title: string;
    execution_time: string;
    status: 'completed' | 'pending' | 'upcoming';
    color: string;
    emoji: string;
}

const RoutineListPage = () => {
    const guestId = getGuestId();
    const navigate = useNavigate();
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [checked, setChecked] = useState<number[]>([]);

    useEffect(() => {
        const fetchRoutines = async () => {
            const res = await axios.get(`https://your-backend-url.com/routines/today?guest_id=${guestId}`);
            setRoutines(res.data);
        };
        fetchRoutines();
    }, [guestId]);

    const toggleCheck = (id: number) => {
        setChecked((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">오늘의 루틴</h2>
            {routines.map((routine) => {
                const isChecked = checked.includes(routine.id);
                const isUpcoming = routine.status === 'upcoming';

                return (
                    <div
                        key={routine.id}
                        className={`flex items-center justify-between p-4 mb-3 rounded-xl shadow-sm border ${
                            isChecked ? 'bg-gray-100 opacity-60' : isUpcoming ? 'bg-gray-50 text-gray-400' : 'bg-white'
                        }`}
                        style={{ borderLeft: `6px solid ${routine.color}` }}
                    >
                        <div>
                            <div className="text-lg">
                                {routine.emoji} {routine.title}
                            </div>
                            <div className="text-sm text-gray-500">{routine.execution_time}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleCheck(routine.id)}
                            />
                            <button
                                className="text-blue-500 text-sm hover:underline"
                                onClick={() => navigate(`/routines/${routine.id}/edit`)}
                            >
                                수정
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RoutineListPage;
