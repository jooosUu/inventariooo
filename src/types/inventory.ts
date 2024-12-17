import { Decimal } from 'decimal.js';

export interface Product {
  id: string;
  name: string;
  barcode: string;
  description?: string;
  stock: number;
  price: Decimal;
  cost: Decimal;
  category: string;
  expirationDate?: Date;
  lastUpdated: Date;
  supplierId: string;
}

export interface Supplier {
  id: string;
  name: string;
  nit: string;
  address: string;
  phone: string;
  email: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: Date;
  customerName: string;
  customerNit: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  subtotal: Decimal;
  tax: Decimal;
  total: Decimal;
  items: InvoiceItem[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  cufe?: string;
  qrCode?: string;
}

export interface InvoiceItem {
  id: string;
  quantity: number;
  unitPrice: Decimal;
  total: Decimal;
  productId: string;
  product: Product;
}