import Weather from "../models/weather.model.js";

const findAll = async () => {
    return await Weather.find();
};

const findByCityAndDate = async (city, date) => {
    return await Weather.findOne({ city, date });
};
const findByCityAndInterval = async (city, startDate, endDate) => {
    return await Weather.find({
        city,
        date: { $gte: startDate, $lte: endDate }
    })
    .sort({ date: 1 });
};
const findByCity = async (city) => {
    return await Weather.find({ city }).sort({ date: 1 });
    // de mas antiguo a mas reciente
};
const create = async (weatherData) => {
    const weather = new Weather(weatherData);
    return await weather.save();
};

export default {
    findAll,
    create,
    findByCityAndDate,
    findByCityAndInterval,
    findByCity,
};