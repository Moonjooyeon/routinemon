// components/SurveyModal.tsx
import React from 'react';
import '../styles/SurveyModal.css';

interface SurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    showNext?: boolean; // ✅ 추가
    children: React.ReactNode;
}


const SurveyModal = ({ isOpen, onClose, onNext, showNext = true, children }: SurveyModalProps) => {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {children}
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={onClose}>닫기</button>
                    {showNext === true ? (
                        <button onClick={onNext}>다음</button>
                    ) : null}

                </div>
            </div>
        </div>
    );
};

export default SurveyModal;