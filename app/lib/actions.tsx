'use server'

import { sql } from '@vercel/postgres';
//Marcar que todas las funciones en este archivo son de
//servidor y por lo tanto no se ejecutan en el cliente.

import { Invoice } from './definitions';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const createInvoiceSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['paid', 'pending']),
    date: z.string()
})

const createInvoiceFormSchema = createInvoiceSchema.omit({
    id: true,
    date: true
})

export async function createInvoce(formData: FormData){
    console.log('createInvoice', formData);
/*     const { amount, customerId, status } = createInvoiceFormSchema.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    }) */
    const { amount, customerId, status } = createInvoiceFormSchema.parse(Object.fromEntries(formData.entries()))

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