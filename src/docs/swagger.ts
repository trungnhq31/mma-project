import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MMA API',
      version: '1.0.0',
      description: 'API documentation for MMA backend',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local' },
    ],
  },
  // Scan route/controller files for @openapi JSDoc blocks
  apis: [
    'src/routes/**/*.ts',
    'src/controllers/**/*.ts',
  ],
});


