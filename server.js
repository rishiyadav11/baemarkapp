const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db'); // make sure this file exports the DB connection
const {notFound, errorHandler} = require("./middleware/errorMiddleware")
// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const kitRoutes = require("./routes/kitRoutes")
const orderRoutes = require('./routes/orderRoutes');
const shiprocketRoutes = require('./routes/shiprocketRoutes');

const paymentRoutes = require('./routes/paymentRoutes');
const addressRoutes = require('./routes/addressRoutes');


const app = express();




const rawBodyMiddleware = require('./middleware/rawBody');
app.use(rawBodyMiddleware); // place it before routes!


app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));


// Increase the JSON payload size limit
app.use(express.json({ limit: '10mb' })); // or more if needed
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/shiprocket', shiprocketRoutes);
app.use('/api/kits',kitRoutes)

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(notFound);
app.use(errorHandler);
// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
