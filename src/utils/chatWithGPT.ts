import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_BASE = import.meta.env.VITE_OPENROUTER_API_BASE;

export const chatWithGPT = async (prompt: string): Promise<string> => {
    try {
        console.log('🔑 API KEY:', API_KEY);
        console.log('🌎 API BASE:', API_BASE);

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
    } catch (error) {
        console.error('❌ GPT 호출 실패:', error);
        throw new Error('GPT 호출 실패');
    }
};
