import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import { apiRouter } from './routes';

const app = express();

// --------------- Security & Parsing ---------------
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --------------- Logging ---------------
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --------------- Rate Limiting ---------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// --------------- Swagger Docs ---------------
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipeak API',
      version: '1.0.0',
      description: 'Goal-based recipe platform API — eat with purpose, fuel your goals.',
    },
    servers: [
      { url: `http://localhost:${env.PORT}`, description: 'Development' },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Recipeak API Docs',
}));

// --------------- Routes ---------------
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', apiRouter);

// --------------- Error Handling ---------------
app.use(errorHandler);

// --------------- Start ---------------
const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Recipeak API running on http://localhost:${env.PORT}`);
    console.log(`📄 Swagger docs at http://localhost:${env.PORT}/api-docs`);
  });
};

start();

export default app;
