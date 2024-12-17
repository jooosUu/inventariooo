import React, { useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { Barcode } from 'lucide-react';

export const BarcodeScanner: React.FC = () => {
  const [barcode, setBarcode] = useState('');
  const getProduct = useInventoryStore((state) => state.getProduct);

  const handleBarcodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const product = getProduct(barcode);
      if (product) {
        // Handle product found
        console.log('Product found:', product);
      } else {
        // Handle product not found
        console.log('Product not found');
      }
      setBarcode('');
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Barcode className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={handleBarcodeInput}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Escanear código de barras..."
        autoFocus
      />
    </div>
  );
};