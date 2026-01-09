import { generateAIResponse, generateAIResponseWeather, generateAIJsonFromUMLResponse } from '../controllers/ai.controller.js';
import { Router } from 'express';

const aiRouter = Router();

aiRouter.post('/ai/chat', generateAIResponse);
aiRouter.post('/ai/weather', generateAIResponseWeather);
aiRouter.post('/ai/uml-to-json', generateAIJsonFromUMLResponse);
export { aiRouter };