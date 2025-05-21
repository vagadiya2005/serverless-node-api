const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Routes for products
router.get('/api/v1/getAllProducts', productController.getAllProducts);
router.get('/api/v1/getProduct', productController.getProductsByIds);
router.post('/api/v1/addProduct', productController.createProduct);
router.put('/api/v1/updateProduct', productController.updateProduct);
router.delete('/api/v1/deleteProduct', productController.deleteProduct);

module.exports = router;