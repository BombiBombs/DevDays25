import axios from "axios";
import weatherRepository from '../repositories/weather.repository.js';

//funcion que llama a la api de weather para almacenar la temperatura de una ciudad determinada en una fecha determinada
async function fetchWeatherData(ciudad, startDate, endDate) {
    try {
    const { latitude, longitude } = await getCoordinates(ciudad);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean`;

    const response = await axios.get(url);
    return response.data;
    } catch (error) {
    console.error("Error al obtener datos climáticos:", error);
    throw error;
    }
}

const getCoordinates = async (nombreCiudad) => {
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
    return null;
    }
}

export const saveWeathers = async (data, ciudad) => {
    const savedWeathers = [];
    const dates = data.daily.time;
    const temperatures = data.daily.temperature_2m_mean;
    for (let i = 0; i < dates.length; i++) {
        const weatherData = {
            city: ciudad,
            date: dates[i],
            temperature: temperatures[i],
        };
        const existingWeather = await weatherRepository.findByCityAndDate(ciudad, dates[i]);
        if (!existingWeather) {
            const savedWeather = await weatherRepository.create(weatherData);
            savedWeathers.push(savedWeather);
        }
    }
    return savedWeathers;
};

export const getAllWeathers = async () => {
    return await weatherRepository.findAll();
};

export default {
    fetchWeatherData,
    saveWeathers,
    getAllWeathers,
};
