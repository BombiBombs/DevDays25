import { generateText } from '../services/ollama.service.js';
import { generateTextWeather, generateJsonFromUML } from '../services/openai.service.js';

export const generateAIResponse = async (req, res) => {
    try {
        const { prompt } = req.body;
        const aiResponse = await generateText(prompt);
        res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const generateAIResponseWeather = async (req, res) => {
    try {
        const { prompt } = req.body;
        const buffer = await generateTextWeather(prompt);
        res.set({
            'Content-Type': 'audio/mpeg',
            //'Content-Disposition': 'attachment; filename="audio.mp3"',
            'Content-Length': buffer.length
        });
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el controlador' });
    }
};
export const generateAIJsonFromUMLResponse = async (req, res) => {
    try {
        const { prompt } = req.body;
        const aiResponse = await generateJsonFromUML(prompt);
        res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};