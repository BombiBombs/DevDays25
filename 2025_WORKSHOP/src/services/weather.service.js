import axios from "axios";
import weatherRepository from '../repositories/weather.repository.js';
import { get } from "mongoose";
import { trace, context, propagation } from '@opentelemetry/api';
import { endpointDuration } from '../otel.js';
const tracer = trace.getTracer('weather-service-tracer');
//funcion que llama a la api de weather para almacenar la temperatura de una ciudad determinada en una fecha determinada
async function fetchWeatherData(ciudad, startDate, endDate) {
    try {
    const { latitude, longitude } = await getCoordinates(ciudad);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,,weather_code,precipitation_probability_mean,wind_speed_10m_mean,cloud_cover_mean`;

    const spanApi = tracer.startSpan('api:open-meteo-fetch');
    const startTime = Date.now();
    const response = await axios.get(url);
    spanApi.end();
    endpointDuration.record(Date.now() - startTime, { 
            step: 'fetchWeatherAPI', 
            city: ciudad 
        });
    return response.data;
    } catch (error) {
    console.error("Error al obtener datos climáticos:", error);
    throw error;
    }
}

const getCoordinates = async (nombreCiudad) => {
    const span = tracer.startSpan('api:geocoding');
    const startTime = Date.now();
    span.setAttribute('city.name', nombreCiudad);
    try {
    const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search`, {
        params: {
        name: nombreCiudad,
        count: 1, // Solo queremos el resultado más probable
        language: 'es',
        format: 'json'
        }
    });

    if (!response.data.results || response.data.results.length === 0) {
        throw new Error("Ciudad no encontrada");
    }
    const { latitude, longitude } = response.data.results[0];
    return { latitude, longitude };
    } catch (error) {
    console.error("Error al obtener coordenadas:", error);
    span.recordException(error);
    return null;
    } finally {
    span.end();
    endpointDuration.record(Date.now() - startTime, { 
            step: 'api_geocoding', 
            city: nombreCiudad 
        });
    }
}

export const saveWeathers = async (data, ciudad) => {
    const start = Date.now();
    const span = tracer.startSpan('db:saveWeathers');
    const savedWeathers = [];
    const dates = data.daily.time;
    const temperatures = data.daily.temperature_2m_mean;
    const weatherCodes = data.daily.weather_code;
    const precipitationProbabilities = data.daily.precipitation_probability_mean;
    const windSpeeds = data.daily.wind_speed_10m_mean;
    const cloudCovers = data.daily.cloud_cover_mean;
    for (let i = 0; i < dates.length; i++) {
        const weatherData = {
            city: ciudad,
            date: dates[i],
            temperature: temperatures[i],
            weatherStatus: weatherParser(weatherCodes[i]),
            precipitationProbability: precipitationProbabilities[i],
            windSpeed: windSpeeds[i],
            cloudCoverage: cloudCovers[i]
        };
        const existingWeather = await weatherRepository.findByCityAndDate(ciudad, dates[i]);
        if (!existingWeather) {
            const savedWeather = await weatherRepository.create(weatherData);
            savedWeathers.push(savedWeather);
        }
    }
    span.end();
    endpointDuration.record(Date.now() - start, { 
            step: 'database_save', 
            city: ciudad 
        });
    return savedWeathers;
};
const weatherParser = (code) => {
    const weatherConditions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Cloudy',
        45: 'Foggy',
        48: 'Rime fog',  // niebla con escarcha
        51: 'Light drizzle',  // lluvizna muy ligera
        53: 'Moderate drizzle',  // lluvizna ligera
        55: 'Heavy drizzle',  // lluvizna moderada
        56: 'Light freezing drizzle',  // llovizna helada ligera
        57: 'Dense freezing drizzle',  // llovizna helada densa
        61: 'Slight rain',  // lluvia ligera
        63: 'Moderate rain',  // lluvia moderada
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',  // nevada ligera
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',  // granizo de nieve
        80: 'Slight rain showers',  // chubascos de lluvia ligeros
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',  // tormenta con granizo ligero
        99: 'Thunderstorm with heavy hail'
    };
    return weatherConditions[code] || 'Unknown';
}
export const getAllWeathers = async () => {
    return await weatherRepository.findAll();
};
export const getAverageTemperatureInterval = async (city, startDate, endDate) => {
    const weathers =  await weatherRepository.findByCityAndInterval(city, startDate, endDate);
    if (weathers.length === 0) {
        return null;
    }
    const totalTemp = weathers.reduce((sum, weather) => sum + weather.temperature, 0);
    return totalTemp / weathers.length;
};
export default {
    fetchWeatherData,
    saveWeathers,
    getAllWeathers,
    getAverageTemperatureInterval
};
