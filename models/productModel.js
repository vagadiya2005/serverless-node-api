const db = require('../config/db');

// Get all products
exports.getAllProducts = async () => {
  try {
    const products = await db.query('SELECT id,name,description,price,stock FROM products WHERE deleted_at IS NULL ORDER BY id ASC');
    return products;

  } catch (error) {
    console.error('[ProductModel] Error fetching all products:', error);
    throw error;
  }
};


exports.getProductsById = async (id) => {
  try {
    const query = `SELECT id, name, description, price, stock FROM products WHERE id = $1 AND deleted_at IS NULL`;
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      console.debug(`[ProductModel] No product found for ID: ${id}`);
      return null;
    }

    console.debug(`[ProductModel] Retrieved product for ID: ${id}`);
    return result.rows[0];
  } catch (error) {
    console.error('[ProductModel] Error fetching product by ID:', error);
    throw error;
  }
};

// Get a single product by ID
exports.getProductsByIds = async (ids) => {
  try {
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ');
    const query = `SELECT id,name,description,price,stock FROM products WHERE id IN (${placeholders}) AND deleted_at IS NULL`;
    const result = await db.query(query, ids);

    console.debug(`[ProductModel] Retrieved ${result.rows.length} product(s) for IDs: ${ids.join(', ')}`);
    return result.rows;
  } catch (error) {
    console.error('[ProductModel] Error fetching products by IDs:', error);
    throw error;
  }
};

// Create a new product
exports.createProduct = async (product) => {
  const { name, description, price, stock } = product;
  try {
    const result = await db.query(
      'INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, stock]
    );
    console.info(`[ProductModel] Created product: ${name}`);
    return result.rows[0];
  } catch (error) {
    console.error('[ProductModel] Error creating product:', error);
    throw error;
  }
};

// Update a product
exports.updateProduct = async (id, product) => {
  const { name, description, price, stock } = product;
  try {
    const result = await db.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4 WHERE id = $5 AND deleted_at IS NULL RETURNING *',
      [name, description, price, stock, id]
    );
    console.info(`[ProductModel] Updated product ID: ${id}`);
    return result.rows[0];
  } catch (error) {
    console.error(`[ProductModel] Error updating product ID: ${id}`, error);
    throw error;
  }
};


exports.softDeleteProduct = async (id) => {
  try {
    // Soft delete: Update the deleted_at timestamp
    const result = await db.query(
      'UPDATE products SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *',
      [id]
    );
  
    if (result.rows.length === 0) {
      console.warn(`[ProductModel] No product found with ID: ${id} for soft delete`);
      return null; // If the product doesn't exist
    }

    console.info(`[ProductModel] Soft deleted product ID: ${id}`);
    return result.rows[0];
  } catch (error) {
    console.error(`[ProductModel] Error soft deleting product ID: ${id}`, error);
    throw error;
  }
};


// Delete a product
exports.deleteProduct = async (id) => {
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      console.warn(`[ProductModel] No product found to delete with ID: ${id}`);
      return null; // Explicitly return null if nothing was deleted
    }

    console.info(`[ProductModel] Deleted product ID: ${id}`);
    return result.rows[0];
  } catch (error) {
    console.error(`[ProductModel] Error deleting product ID: ${id}`, error);
    throw error;
  }
};
