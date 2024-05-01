import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export async function getAiResponse(content){
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: content }],
            model: 'gpt-3.5-turbo',
        });
        return chatCompletion.choices[0];
    } catch (error) {
        return error;
    }
}