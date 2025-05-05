
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../utils/auth.ts'; // 🔧 로그인 유틸 따로 관리 추천

const StartPage = () => {
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const result = await loginWithGoogle(); // 백엔드 or Firebase에서 토큰 받아오기

            const isNewUser = result.isNewUser; // 백에서 분기 처리해주는 게 좋음
            localStorage.setItem('guest_id', result.guestId); // 혹은 token 저장

            if (isNewUser) {
                navigate('/welcome');
            } else {
                navigate('/main');
            }
        } catch (err) {
            console.error('로그인 실패:', err);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '10rem' }}>
            <h1>Routinenyang</h1>
            <button onClick={handleLogin} style={{
                marginTop: '2rem',
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                borderRadius: '8px',
                backgroundColor: '#4285F4',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
            }}>
                Google 로그인
            </button>
        </div>
    );
};

export default StartPage;
