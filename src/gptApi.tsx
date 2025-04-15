import axios from "axios";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_BASE = import.meta.env.VITE_OPENROUTER_API_BASE;

export const getRoutineSuggestions = async (goal: string = "건강한 생활"): Promise<string> => {
    const prompt = `나의 목표는 "${goal}"이야. 그에 맞는 일일 루틴을 추천해줘.`;

    console.log("💬 보낼 프롬프트:", prompt);

    const response = await axios.post(
        `${OPENROUTER_API_BASE}/chat/completions`,
        {
            model: "openai/gpt-3.5-turbo", // 또는 다른 모델 사용 가능 ex) "mistralai/mistral-7b"
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        },
        {
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                // Optional headers
                "HTTP-Referer": "https://your-project-url.com", // 배포 시 실제 URL
                "X-Title": "RoutineGPT",
            },
        }
    );

    console.log("📦 OpenRouter 응답 전체:", response.data);
    console.log("🧾 루틴 내용:", response.data.choices[0].message.content);

    return response.data.choices[0].message.content;
};
