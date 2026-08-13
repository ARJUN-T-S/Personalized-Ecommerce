const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MERN Multi-Store E-Commerce API',
      version: '1.0.0',
      description: 'REST API documentation for the Personalized Multi-Store E-Commerce Platform.',
    },
    servers: [
      {
        url: '/',
        description: 'Current Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT Bearer token',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/api/auth/user/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register customer user',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } } } } }
          },
          responses: { 201: { description: 'User registered' } }
        }
      },
      '/api/auth/user/login': {
        post: {
          tags: ['Auth'],
          summary: 'Customer login',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } } } }
          },
          responses: { 200: { description: 'JWT Token returned' } }
        }
      },
      '/api/auth/user/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get logged-in user profile',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'User profile' } }
        }
      },
      '/api/auth/admin/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register store admin',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', required: ['name', 'email', 'password', 'storeName'], properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, storeName: { type: 'string' }, description: { type: 'string' } } } } }
          },
          responses: { 201: { description: 'Admin registered' } }
        }
      },
      '/api/auth/admin/login': {
        post: {
          tags: ['Auth'],
          summary: 'Store admin login',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } } } }
          },
          responses: { 200: { description: 'JWT Token returned' } }
        }
      },
      '/api/auth/admin/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get logged-in admin profile',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Admin profile' } }
        }
      },
      '/api/admins': {
        get: {
          tags: ['Stores'],
          summary: 'Get all stores',
          responses: { 200: { description: 'List of stores' } }
        }
      },
      '/api/admins/{id}': {
        get: {
          tags: ['Stores'],
          summary: 'Get store details by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Store data' } }
        }
      },
      '/api/products/store/{adminId}': {
        get: {
          tags: ['Products'],
          summary: 'Get store products',
          parameters: [{ in: 'path', name: 'adminId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Products list' } }
        }
      },
      '/api/products': {
        get: {
          tags: ['Products'],
          summary: 'Get my store products (Admin)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'My products' } }
        },
        post: {
          tags: ['Products'],
          summary: 'Create product (Admin)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', required: ['name', 'price'], properties: { name: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, category: { type: 'string' }, stock: { type: 'number' }, image: { type: 'string' } } } } }
          },
          responses: { 201: { description: 'Product created' } }
        }
      },
      '/api/products/{id}': {
        get: {
          tags: ['Products'],
          summary: 'Get product by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Product details' } }
        },
        put: {
          tags: ['Products'],
          summary: 'Update product by ID (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Product updated' } }
        },
        delete: {
          tags: ['Products'],
          summary: 'Delete product by ID (Admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Product deleted' } }
        }
      },
      '/api/carts': {
        get: {
          tags: ['Cart'],
          summary: 'Get user carts',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'User carts' } }
        },
        post: {
          tags: ['Cart'],
          summary: 'Add item to cart',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', required: ['productId', 'storeId'], properties: { productId: { type: 'string' }, storeId: { type: 'string' }, quantity: { type: 'number' } } } } }
          },
          responses: { 200: { description: 'Cart updated' } }
        }
      },
      '/api/carts/{adminId}': {
        get: {
          tags: ['Cart'],
          summary: 'Get cart for store',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'adminId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Store cart' } }
        },
        delete: {
          tags: ['Cart'],
          summary: 'Clear cart for store',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'adminId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Cart cleared' } }
        }
      },
      '/api/carts/{adminId}/items/{productId}': {
        put: {
          tags: ['Cart'],
          summary: 'Update cart item quantity',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'adminId', required: true, schema: { type: 'string' } },
            { in: 'path', name: 'productId', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Item updated' } }
        },
        delete: {
          tags: ['Cart'],
          summary: 'Remove item from cart',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'adminId', required: true, schema: { type: 'string' } },
            { in: 'path', name: 'productId', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Item removed' } }
        }
      },
      '/api/orders': {
        post: {
          tags: ['Orders'],
          summary: 'Place new order',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Order created' } }
        }
      },
      '/api/orders/my': {
        get: {
          tags: ['Orders'],
          summary: 'Get user orders history',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'My orders' } }
        }
      },
      '/api/orders/store': {
        get: {
          tags: ['Orders'],
          summary: 'Get store orders (Admin)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Store orders' } }
        }
      },
      '/api/categories': {
        get: {
          tags: ['Categories'],
          summary: 'Get admin categories',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Categories' } }
        },
        post: {
          tags: ['Categories'],
          summary: 'Create category (Admin)',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Category created' } }
        }
      },
      '/api/ratings/product/{productId}': {
        get: {
          tags: ['Ratings'],
          summary: 'Get product ratings',
          parameters: [{ in: 'path', name: 'productId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Ratings list' } }
        }
      },
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          responses: { 200: { description: 'Server running' } }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../server.js')
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  // Endpoint to serve raw JSON spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Serve Swagger UI at /api-docs and /docs
  const swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MERN E-Commerce API Documentation',
    swaggerOptions: {
      url: '/api-docs.json'
    }
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, swaggerUiOptions));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(null, swaggerUiOptions));

  console.log('Swagger API Documentation available at /api-docs');
};

module.exports = setupSwagger;
