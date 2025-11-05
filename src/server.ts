import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { v1Router } from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { logger } from './utils/logger.util';
import { connectMongo } from './config/database';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.use('/api/v1', v1Router);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-json', (_req, res) => res.json(swaggerSpec));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await connectMongo();
    logger.info('MongoDB connection established');
  } catch (err) {
    logger.error('Database connection failed', { error: err });
  }

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

bootstrap();

