// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Restaurant & Bar Management API',
      version: '1.0.0',
      description: 'API documentation for restaurant backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // points to your routes
};

export const swaggerSpec = swaggerJSDoc(options);
