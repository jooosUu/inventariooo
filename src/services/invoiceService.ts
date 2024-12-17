import { v4 as uuidv4 } from 'uuid';
import db from './database';
import { Invoice, InvoiceItem } from '../types/inventory';
import { generateCUFE, generateQRCode } from '../utils/electronic-invoice';
import { Decimal } from 'decimal.js';

export const createInvoice = async (
  invoice: Omit<Invoice, 'id' | 'cufe' | 'qrCode' | 'status'>
) => {
  const id = uuidv4();
  const cufe = await generateCUFE(invoice);
  const qrCode = await generateQRCode(invoice, cufe);

  const stmt = db.prepare(`
    INSERT INTO invoices (
      id, number, customer_name, customer_nit, customer_address,
      customer_phone, customer_email, subtotal, tax, total,
      cufe, qr_code
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    invoice.number,
    invoice.customerName,
    invoice.customerNit,
    invoice.customerAddress,
    invoice.customerPhone,
    invoice.customerEmail,
    invoice.subtotal.toString(),
    invoice.tax.toString(),
    invoice.total.toString(),
    cufe,
    qrCode
  );

  // Insert invoice items
  const itemStmt = db.prepare(`
    INSERT INTO invoice_items (
      id, invoice_id, product_id, quantity, unit_price, total
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const item of invoice.items) {
    itemStmt.run(
      uuidv4(),
      id,
      item.productId,
      item.quantity,
      item.unitPrice.toString(),
      item.total.toString()
    );
  }

  return getInvoice(id);
};

export const getInvoice = (id: string) => {
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(id);
  if (!invoice) return null;

  const items = db.prepare(`
    SELECT i.*, p.* 
    FROM invoice_items i 
    JOIN products p ON i.product_id = p.id 
    WHERE i.invoice_id = ?
  `).all(id);

  return {
    ...invoice,
    subtotal: new Decimal(invoice.subtotal),
    tax: new Decimal(invoice.tax),
    total: new Decimal(invoice.total),
    date: new Date(invoice.date),
    created_at: new Date(invoice.created_at),
    updated_at: new Date(invoice.updated_at),
    items: items.map(item => ({
      ...item,
      unit_price: new Decimal(item.unit_price),
      total: new Decimal(item.total)
    }))
  };
};