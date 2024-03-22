import { swGitRouter } from './routes/gitRoute';

const swaggerDoc = {
  openapi: '3.0.0',
  info: {
    title: `${process.env.ENV_NAME} Dependency Checker API Documentation`,
    version: '1.0.0',
    description: 'RESTful API Documentation with Joi Validation',
  },
  paths: {
    ...swGitRouter,
  },
};

export { swaggerDoc };
