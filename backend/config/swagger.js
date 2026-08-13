const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MERN Multi-Store E-Commerce API',
      version: '1.0.0',
      description: 'Comprehensive REST API documentation for the Personalized Multi-Store E-Commerce Platform.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: '/',
        description: 'Current Environment Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Bearer token in the format: Bearer <token>',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './server.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  // Serve Swagger API docs at /api-docs and /docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MERN E-Commerce API Documentation',
  }));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Endpoint to serve raw JSON spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Swagger API Documentation available at /api-docs');
};

module.exports = setupSwagger;
