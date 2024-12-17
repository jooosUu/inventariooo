import { utils, writeFile } from 'xlsx';

export const generateExcelTemplate = () => {
  const template = [
    {
      nombre: 'Ejemplo Producto',
      codigo_barras: '7501234567890',
      descripcion: 'Descripción del producto',
      stock: 100,
      precio: 25000,
      costo: 15000,
      categoria: 'Electrónicos',
      fecha_vencimiento: '2025-12-31',
      proveedor_id: 'ID_PROVEEDOR'
    }
  ];

  const ws = utils.json_to_sheet(template);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Productos');

  // Add column widths
  ws['!cols'] = [
    { wch: 20 }, // nombre
    { wch: 15 }, // codigo_barras
    { wch: 30 }, // descripcion
    { wch: 10 }, // stock
    { wch: 12 }, // precio
    { wch: 12 }, // costo
    { wch: 15 }, // categoria
    { wch: 15 }, // fecha_vencimiento
    { wch: 15 }, // proveedor_id
  ];

  writeFile(wb, 'template.xlsx');
};