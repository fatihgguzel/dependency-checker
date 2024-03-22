import * as dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import { response, error } from './helpers';
import { swaggerDoc } from './swagger.def';
import swaggerUi from 'swagger-ui-express';
import { SwaggerTheme } from 'swagger-themes';
import { gitRoute } from './routes';
import * as QueueService from './services/queueService';

const app = express();

app.use(helmet());
app.use(cors());
app.use(
  bodyParser.json({
    limit: '1mb',
  }),
);

const swaggerTheme = new SwaggerTheme('v3');
const swaggerOptions = {
  customCss: swaggerTheme.getBuffer('dark'),
  customSiteTitle: `Dependency Checker API Documentation`,
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, swaggerOptions));

app.get('/api', (req: Request, res: Response) => {
  try {
    response(res, {
      message: 'General Kenobi. You are a bold one!',
    });
  } catch (err) {
    error(res, err);
  }
});

app.use('/api/git', gitRoute);

app.all('*', (req: Request, res: Response) => {
  response(res, {
    data: null,
    code: 404,
    message: `${req.method} ${req.url} - Your new API? My allegiance is to the republic, to democracy.`,
  });
});

const PORT = parseInt(process.env.PORT || '3000');

if (!PORT) {
  console.log('PORT not found in .env');
  process.exit(0);
}

const server = app.listen(PORT, async () => {
  await QueueService.clearQueue();
  console.log(`Server is up on http://localhost:${PORT}/api`);
  console.log(`Swagger documentation is on the http://localhost:${PORT}/api-docs`);
});

export { app, server };
