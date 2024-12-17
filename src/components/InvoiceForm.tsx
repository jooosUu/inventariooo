import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Decimal } from 'decimal.js';

const invoiceSchema = z.object({
  customerName: z.string().min(1, 'El nombre es requerido'),
  customerNit: z.string().min(1, 'El NIT es requerido'),
  customerAddress: z.string().min(1, 'La dirección es requerida'),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.string().transform(val => new Decimal(val)),
  }))
});

export const InvoiceForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(invoiceSchema)
  });

  const onSubmit = async (data: any) => {
    // Implementar lógica de creación de factura
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre del Cliente
        </label>
        <input
          type="text"
          {...register('customerName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.customerName && (
          <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
        )}
      </div>
      
      {/* Agregar más campos del formulario */}
      
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Generar Factura
      </button>
    </form>
  );
};