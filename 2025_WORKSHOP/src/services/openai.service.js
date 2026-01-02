import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export const generateText = async (prompt) => {
    const response = await openai.responses.create({
        //esta capado al gpt5 la key
        model: 'gpt-5-mini',
        input: prompt,
    });
    return response.output_text;
};