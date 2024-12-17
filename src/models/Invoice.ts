import { getDatabase } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, InvoiceItem } from '../types/inventory';
import { Decimal } from 'decimal.js';
import { INVOICE_STATUS } from '../config/constants';

const db = getDatabase();

export const createInvoice = (invoice: Omit<Invoice, 'id' | 'status'>) => {
  const id = uuidv4();
  
  db.transaction(() => {
    // Insert invoice
    const invoiceStmt = db.prepare(`
      INSERT INTO invoices (
        id, number, customer_name, customer_nit, customer_address,
        customer_phone, customer_email, subtotal, tax, total,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    invoiceStmt.run(
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
      INVOICE_STATUS.PENDING
    );

    // Insert items
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
  })();

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

  return mapInvoiceRow(invoice, items);
};

const mapInvoiceRow = (invoice: any, items: any[]): Invoice => ({
  ...invoice,
  subtotal: new Decimal(invoice.subtotal),
  tax: new Decimal(invoice.tax),
  total: new Decimal(invoice.total),
  date: new Date(invoice.date),
  items: items.map(mapInvoiceItemRow)
});