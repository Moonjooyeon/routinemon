import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    // 여길 통해 백엔드로 사용자 등록/확인 요청 가능
    const response = await fetch('/auth/google-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    return {
        guestId: data.guestId,
        isNewUser: data.isNewUser,
    };
};
