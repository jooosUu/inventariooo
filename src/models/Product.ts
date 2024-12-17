import { getDatabase } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { Decimal } from 'decimal.js';
import { Product } from '../types/inventory';

const db = getDatabase();

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
  
  return mapProductRow(row);
};

const mapProductRow = (row: any): Product => ({
  ...row,
  price: new Decimal(row.price),
  cost: new Decimal(row.cost),
  expirationDate: row.expiration_date ? new Date(row.expiration_date) : undefined,
  lastUpdated: new Date(row.last_updated),
});