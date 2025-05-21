const productModel = require('../models/productModel');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json({
    data: {
      total_product: products.rowCount,
      products: products.rows
    }
    });
    console.info('[ProductController] Successfully fetched all products.');
  } catch (error) {
    console.error('[ProductController] Error fetching all products:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get a single product
exports.getProductsByIds = async (req, res) => {
  try {
    const idsParam = req.query.ids;
    if (!idsParam) {
      return res.status(400).json({ error: 'Missing product ID(s)' });
    }

    // Convert comma-separated string into array of integers
    const ids = idsParam
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      return res.status(400).json({ error: 'No valid product IDs provided' });
    }

    console.debug(`[ProductController] Fetching products with IDs: ${ids.join(', ')}`);

    const products = await productModel.getProductsByIds(ids);

    if (products.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'No products found for the given IDs' });
    }

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products },
    });
  } catch (error) {
    console.error('[ProductController] Error fetching products by IDs:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message,
    });
  }
};

exports.getProductsById = async (req,res) => {

  try{

  }catch (error) {

  }

};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name and price are required',
      });
    }

    const newProduct = await productModel.createProduct({ name, description, price, stock });

    console.info(`[ProductController] Product created: ${name}`);
    res.status(201).json({
      status: 'success',
      data: { product: newProduct },
    });
  } catch (error) {
    console.error('[ProductController] Error creating product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await productModel.getProductsById(id);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    const updatedProduct = await productModel.updateProduct(id, {
      name: req.body.name || product.name,
      description: req.body.description || product.description,
      price: req.body.price || product.price,
      stock: req.body.stock !== undefined ? req.body.stock : product.stock,
    });

    console.info(`[ProductController] Product updated: ID ${id}`);
    res.status(200).json({
      status: 'success',
      data: { product: updatedProduct },
    });
  } catch (error) {
    console.error('[ProductController] Error updating product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await productModel.softDeleteProduct(id);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    console.info(`[ProductController] Product deleted: ID ${id}`);
    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('[ProductController] Error deleting product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message,
    });
  }
};
