import axios from "axios";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function getRoutineSuggestions(goal: string) {
    const prompt = `
[상황]: 사용자가 '${goal}'을 달성하기 위해 루틴을 만들고 싶어 합니다.
[요청]: 이 사용자가 5분 이내에 실천할 수 있는 아주 쉬운 루틴을 3가지 추천해주세요.
[조건]: 초보자도 부담 없이 시작할 수 있어야 합니다.
[출력 형식]: 
1. ~
2. ~
3. ~
`;

    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        },
        {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.data.choices[0].message.content;
}
