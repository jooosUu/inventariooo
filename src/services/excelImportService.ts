import { read, utils } from 'xlsx';
import { Product } from '../types/inventory';
import { Decimal } from 'decimal.js';
import { createProduct } from './productService';

interface ExcelProduct {
  nombre: string;
  codigo_barras: string;
  descripcion?: string;
  stock: number;
  precio: number;
  costo: number;
  categoria: string;
  fecha_vencimiento?: string;
  proveedor_id: string;
}

export const validateExcelData = (data: unknown[]): ExcelProduct[] => {
  return data.map((row: any) => {
    // Validate required fields
    if (!row.nombre || !row.codigo_barras || !row.precio || !row.costo || !row.categoria || !row.proveedor_id) {
      throw new Error('Faltan campos requeridos en el archivo Excel');
    }

    return {
      nombre: row.nombre,
      codigo_barras: row.codigo_barras.toString(),
      descripcion: row.descripcion,
      stock: Number(row.stock) || 0,
      precio: Number(row.precio),
      costo: Number(row.costo),
      categoria: row.categoria,
      fecha_vencimiento: row.fecha_vencimiento,
      proveedor_id: row.proveedor_id
    };
  });
};

export const importExcelProducts = async (file: File): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(firstSheet);
        
        const validatedData = validateExcelData(jsonData);
        
        const products: Product[] = [];
        
        for (const row of validatedData) {
          const product = await createProduct({
            name: row.nombre,
            barcode: row.codigo_barras,
            description: row.descripcion,
            stock: row.stock,
            price: new Decimal(row.precio),
            cost: new Decimal(row.costo),
            category: row.categoria,
            expirationDate: row.fecha_vencimiento ? new Date(row.fecha_vencimiento) : undefined,
            supplierId: row.proveedor_id
          });
          
          if (product) {
            products.push(product);
          }
        }
        
        resolve(products);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo Excel'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};