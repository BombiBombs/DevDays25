import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    weatherStatus: {  //descripcion del estado del tiempo
        type: String,
        required: true,
    },
    precipitationSum: {  //suma de precipitacion
        type: Number,
        required: true,
    },
    windSpeed: {  //maxima velocidad del viento a 10m
        type: Number,
        required: true,
    },
    cloudCoverage: {
        type: Number,
        required: true,
    },
});

const Weather = mongoose.model('Weather', weatherSchema);

export default Weather;