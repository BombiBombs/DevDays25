import weatherService from '../services/weather.service.js';
import { trace, context } from '@opentelemetry/api';
import { endpointDuration } from '../otel.js'; 
import { cidrv4 } from 'zod';
const tracer = trace.getTracer('weather-controller-tracer');
export const getAllWeathers = async (req, res) => {
    const startTime = Date.now();
    try {
        const weathers = await weatherService.getAllWeathers();
        res.status(200).json(weathers);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        const duration = Date.now() - startTime;
        endpointDuration.record(duration, { 
            endpoint: 'getAllWeathers',
            method: 'GET'
        });
    }
};

export const fetchAndSaveWeathers = async (req, res) => {
    const startTime = Date.now();
    const rootSpan = tracer.startSpan('controller:fetchAndSaveWeathers');
    return await context.with(trace.setSpan(context.active(), rootSpan), async () => {
    try {
        const ciudad = req.body.ciudad;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const weatherData = await weatherService.fetchWeatherData(ciudad, start_date, end_date);
        const savedData = await weatherService.saveWeathers(weatherData, ciudad);
        res.status(200).json(savedData);
    } catch (error) {
        console.error(error);
        rootSpan.setStatus({ code: 2, message: 'Error en la petición' });
        res.status(500).json({ message: 'Error en la petición' });
    } finally {
        const duration = Date.now() - startTime;
        endpointDuration.record(duration, { 
            endpoint: 'fetchAndSaveWeather',
            method: 'POST',
            city: req.body.ciudad
        });
    }
    });
}