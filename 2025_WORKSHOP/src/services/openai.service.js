import OpenAI from 'openai';
import { getAverageTemperatureInterval, getAverageCloudCoverageInterval, getMaxWindSpeedInterval, getTotalPrecipitationInterval,getWeatherStatusInterval } from './weather.service.js';
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import path from 'path';
import fs from 'fs';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY2,
})

export const generateText = async (prompt) => {
    const response = await openai.responses.create({
        //esta capado al gpt5 la key
        model: 'gpt-5-mini',
        input: prompt,
    });
    return response.output_text;
};

export const generateTextWeather = async (prompt) => {
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const enhancedPrompt = `Current date is ${currentDate}. ${prompt}`;
    let ciudad = 'weather_report';
    const tools = [
        {
            type: 'function',
            name: 'getWeatherAnalysis',
            description: 'Obtiene un análisis completo del clima: media de temp, total de lluvia , viento máximo, cobertura nubosa media y estados del clima en un intervalo de fechas para una ciudad dada.',
            parameters: {
                type: 'object',
                properties: {
                    city: { type: 'string', description: 'Nombre de la ciudad' },
                    startDate: { type: 'string', description: 'Fecha de inicio en formato YYYY-MM-DD' },
                    endDate: { type: 'string', description: 'Fecha de fin en formato YYYY-MM-DD' }
                },
                required: ['city', 'startDate', 'endDate']
            }
        },
    ];
    let messages = [];
    messages.push({ role: 'user', content: enhancedPrompt });
    const response = await openai.responses.create({
        model: 'gpt-5-mini',
        input: messages,
        tools: tools,
        tool_choice: 'auto'
    });
    for (const part of response.output) {
        if (part.type === 'function_call' && part.name === 'getWeatherAnalysis') {
            const args = JSON.parse(part.arguments);
            const analysis = {
                avgTemp: await getAverageTemperatureInterval(args.city, args.startDate, args.endDate),
                totalRain: await getTotalPrecipitationInterval(args.city, args.startDate, args.endDate),
                maxWind: await getMaxWindSpeedInterval(args.city, args.startDate, args.endDate),
                avgCloud: await getAverageCloudCoverageInterval(args.city, args.startDate, args.endDate),
                statusList: await getWeatherStatusInterval(args.city, args.startDate, args.endDate)
            };
            ciudad = args.city;
            messages.push({
                role: 'system',
                content: `Datos reales obtenidos: Ciudad: ${args.city}. 
                    Media Temp: ${analysis.avgTemp.toFixed(1)}°C. 
                    Lluvia total: ${analysis.totalRain}mm. 
                    Viento máx: ${analysis.maxWind}km/h. 
                    Cobertura nubosa media: ${analysis.avgCloud.toFixed(1)}%. 
                    Estados del clima: ${analysis.statusList.join(', ')}.
                    Días analizados: ${analysis.countDays}.`,
            });
        }
    }
    const response2 = await openai.responses.create({
        model: 'gpt-5-mini',
        instructions: 'Basandote en los resultados anteriores, responde a la pregunta del usuario respondiendo como un presentador de noticias del clima,evita usar palabras en ingles, traducelas si hace falta',
        input: messages,
    });
    const mp3 = await openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: 'alloy',
        input: response2.output_text,
        format: 'mp3',

    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const outputFolder = path.resolve("./uploads/audios");
    const fileName = `${ciudad.toLowerCase()}-${Date.now()}.mp3`;
    const speechFile = path.join(outputFolder, fileName);
    await fs.promises.writeFile(speechFile, buffer);
    console.log(` Audio guardado en: ${speechFile}`)
    return buffer;
}
const umlZodSchema = z.object({
  classes: z.array(z.object({
    name: z.string(),
    attributes: z.array(z.string()),
    methods: z.array(z.string())
  })),
  relationships: z.array(z.object({
    from: z.string(),
    to: z.string(),
    relationship_type: z.enum(["inheritance", "composition", "aggregation", "association"])
  }))
});

export const generateJsonFromUML = async (prompt) => {
    const response = await openai.responses.parse({
        model: 'gpt-5-mini',
        input: `Genera un JSON que represente el siguiente diagrama UML: ${prompt}. no incluyendo en los atributos y metodos el + de delante`,
        text: {format: zodTextFormat(umlZodSchema, "umlSchema")},
    });
    return response.output_parsed;
};
