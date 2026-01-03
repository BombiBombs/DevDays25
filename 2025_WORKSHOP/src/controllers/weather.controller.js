import weatherService from '../services/weather.service.js';

export const getAllWeathers = async (req, res) => {
    try {
        const weathers = await weatherService.getAllWeathers();
        res.status(200).json(weathers);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const fetchAndSaveWeathers = async (req, res) => {
    try {
        const ciudad = req.body.ciudad;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const weatherData = await weatherService.fetchWeatherData(ciudad, start_date, end_date);
        const savedData = await weatherService.saveWeathers(weatherData, ciudad);
        res.status(200).json(savedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en la petición' });
    }
}