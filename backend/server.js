require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const registerRoute = require('./routes/register');
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth');

const app = express();

// Enable CORS for frontend requests
app.use(cors({
  origin: '*', // You can restrict to your frontend URL later
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/register', registerRoute);
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);

// Health check route
app.get('/', (req, res) => res.send('JNTUGV Certification Backend Running'));

// Environment variables
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jntugv_cert';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});
