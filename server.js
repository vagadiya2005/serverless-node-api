const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const productRoutes = require('./routes/productRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  console.log('req is hit at /');
  res.json({ message: 'Welcome to Node.js PostgreSQL API' });
});

app.use(productRoutes);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});