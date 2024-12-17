import { v4 as uuidv4 } from 'uuid';
import db from './database';
import { Product } from '../types/inventory';
import { Decimal } from 'decimal.js';

export const createProduct = (product: Omit<Product, 'id' | 'lastUpdated'>) => {
  const stmt = db.prepare(`
    INSERT INTO products (
      id, name, barcode, description, stock, price, cost,
      category, expiration_date, supplier_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const id = uuidv4();
  stmt.run(
    id,
    product.name,
    product.barcode,
    product.description,
    product.stock,
    product.price.toString(),
    product.cost.toString(),
    product.category,
    product.expirationDate?.toISOString(),
    product.supplierId
  );

  return getProduct(id);
};

export const getProduct = (id: string) => {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  const row = stmt.get(id);
  
  if (!row) return null;
  
  return {
    ...row,
    price: new Decimal(row.price),
    cost: new Decimal(row.cost),
    expiration_date: row.expiration_date ? new Date(row.expiration_date) : undefined,
    last_updated: new Date(row.last_updated),
    created_at: new Date(row.created_at)
  };
};

export const getProductByBarcode = (barcode: string) => {
  const stmt = db.prepare('SELECT * FROM products WHERE barcode = ?');
  const row = stmt.get(barcode);
  
  if (!row) return null;
  
  return {
    ...row,
    price: new Decimal(row.price),
    cost: new Decimal(row.cost),
    expiration_date: row.expiration_date ? new Date(row.expiration_date) : undefined,
    last_updated: new Date(row.last_updated),
    created_at: new Date(row.created_at)
  };
};

export const updateStock = (id: string, quantity: number) => {
  const stmt = db.prepare(`
    UPDATE products 
    SET stock = stock + ?, 
        last_updated = CURRENT_TIMESTAMP 
    WHERE id = ?
  `);
  
  stmt.run(quantity, id);
  return getProduct(id);
};