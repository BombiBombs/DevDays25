import express from 'express';
import { userRouter } from './routes/user.routes.js';
import swaggerUi from 'swagger-ui-express';
import { bundle } from '@readme/openapi-parser';
import { issueRouter } from './routes/issue.routes.js';
import { auditRouter } from './routes/audit.routes.js';
import { aiRouter } from './routes/ai.routes.js';
import { telemetryRouter } from './routes/telemetry.routes.js';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use('/api/v1', aiRouter);

app.use(cors({
  origin: 'http://localhost:3001', // La URL de tu frontend de Next.js
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/api/v1', auditRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/v1', userRouter);
bundle('src/docs/openapi.yaml')
    .then((api) => {
        app.use('/docs', swaggerUi.serve, swaggerUi.setup(api));
    })
    .catch((err) => {
        console.error('Error loading OpenAPI document:', err);
    });

app.use('/api/v1', issueRouter);

app.use('/api/v1', telemetryRouter);

export default app;