import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { importExcelProducts } from '../services/excelImportService';
import { useInventoryStore } from '../store/useInventoryStore';

export const ExcelImport: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addProduct = useInventoryStore((state) => state.addProduct);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const products = await importExcelProducts(file);
      products.forEach(addProduct);
      alert(`Se importaron ${products.length} productos exitosamente`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al importar el archivo');
    } finally {
      setIsLoading(false);
      // Reset input
      event.target.value = '';
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Importar desde Excel</h2>
        <a
          href="/template.xlsx"
          download
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          Descargar plantilla
        </a>
      </div>

      <div className="mt-2">
        <label
          htmlFor="excel-upload"
          className={`
            relative cursor-pointer rounded-md bg-white font-medium
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'text-blue-600 hover:text-blue-500'}
          `}
        >
          <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <span>Arrastra un archivo o</span>
                <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ml-1">
                  selecciona
                  <input
                    id="excel-upload"
                    name="excel-upload"
                    type="file"
                    className="sr-only"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                </span>
              </div>
              <p className="text-xs text-gray-500">Excel (.xlsx, .xls)</p>
            </div>
          </div>
        </label>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="mt-2 text-sm text-gray-500">
          Importando productos...
        </div>
      )}
    </div>
  );
};