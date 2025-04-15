// utils/chatWithGPT.ts
import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_BASE = import.meta.env.VITE_OPENROUTER_API_BASE;

export const chatWithGPT = async (prompt: string): Promise<string> => {
    const response = await axios.post(
        `${API_BASE}/chat/completions`,
        {
            model: 'openai/gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        },
        {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data.choices[0].message.content;
};
