import type { Options } from "swagger-jsdoc";

const swaggerOptions: Options= {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for my bite-speed-backend',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export default swaggerOptions;
