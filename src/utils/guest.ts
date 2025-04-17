
export const getGuestId = () => {
    const existing = localStorage.getItem('guestId');
    if (existing) return existing;

    const newId = crypto.randomUUID();
    localStorage.setItem('guestId', newId);
    return newId;
};
