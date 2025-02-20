const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
dotenv.config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");







const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());


const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Learning API documentation using swagger",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  
    apis: ["./controllers/*.js"],
  };
  
  const specification = swaggerJsdoc(options);
  
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specification));
// Routes

const productRoutes =require("./routes/productRoutes");

app.use('/products', productRoutes);
const categoryRoutes =require("./routes/categoryRoutes");
app.use('/categories', categoryRoutes);
const cartRoutes =require("./routes/cartRoutes");
app.use('/cart', cartRoutes);
const orderRoutes =require("./routes/orderRoutes");
app.use('/orders', orderRoutes);
const authRoutes =require("./routes/authRoutes");
app.use('/auth', authRoutes);




//connecting database

// sequelize.sync({ force: false })
//     .then(() => console.log('Database connected'))
//     .catch(err => console.error('Database connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));