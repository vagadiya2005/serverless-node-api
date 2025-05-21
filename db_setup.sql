
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO products (name, description, price, stock) VALUES 
('Laptop', 'High-performance laptop with 16GB RAM', 999.99, 15),
('Smartphone', '5G smartphone with triple camera', 699.99, 25),
('Headphones', 'Noise-cancelling wireless headphones', 199.99, 40);