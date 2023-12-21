'use server'

import { sql } from '@vercel/postgres';
//Marcar que todas las funciones en este archivo son de
//servidor y por lo tanto no se ejecutan en el cliente.

import { Invoice } from './definitions';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const InvoiceSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['paid', 'pending']),
    date: z.string()
})

const InvoiceFormSchema = InvoiceSchema.omit({
    id: true,
    date: true
})

export async function createInvoce(formData: FormData){
/*     const { amount, customerId, status } = createInvoiceFormSchema.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    }) */
    const { amount, customerId, status } = InvoiceFormSchema.parse(Object.fromEntries(formData.entries()))

    //transformamos para evitar errores de redondeo
    const amountInCent = amount * 100

    //creamos fecha
    const [date] = new Date().toISOString().split('T')
    
    await sql`
        INSERT INTO invoices(customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCent}, ${status}, ${date})
    `
    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = InvoiceFormSchema.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }

  export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  }