const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const app = express();
const port = 3000;

// untuk menangani request json
app.use(express.json());

// config swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentasion Belajar NodeJs',
      version: '0.0.1',
      description: 'Belajar NodeJs',
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// import router
const userRouter = require('./src/routes/user.routes');
const nationRouter = require('./src/routes/nation.routes');
const authRouter = require('./src/routes/auth.routes');
const uploadRouter = require('./src/routes/upload.routes');

app.use(express.static(path.join(__dirname, 'public/')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', userRouter);
app.use('/api', nationRouter);
app.use('/api', authRouter);
app.use('/api', uploadRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
