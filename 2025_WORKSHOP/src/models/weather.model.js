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
    }
});

const Weather = mongoose.model('Weather', weatherSchema);

export default Weather;