import { Router } from 'express';
import { getAllWeathers, fetchAndSaveWeathers } from '../controllers/weather.controller.js';

const weatherRouter = Router();

weatherRouter.get('/weathers', getAllWeathers);
weatherRouter.post('/weathers', fetchAndSaveWeathers);
export { weatherRouter };
