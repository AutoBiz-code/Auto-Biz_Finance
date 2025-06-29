
'use server';
/**
 * @fileOverview A Genkit flow to generate a professional HTML invoice from structured data.
 *
 * - generateInvoiceHtml - A function that generates an HTML string for an invoice.
 * - GenerateInvoiceHtmlInput - The input type for the generateInvoiceHtml function.
 * - GenerateInvoiceHtmlOutput - The return type for the generateInvoiceHtml function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { GstPdfParams } from '@/actions/autobiz-features';

const GenerateInvoiceHtmlInputSchema = z.object({
  userId: z.string(),
  companyName: z.string(),
  companyAddress: z.string(),
  companyGstin: z.string(),
  companyEmail: z.string(),
  companyPhone: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  customerName: z.string(),
  customerAddress: z.string(),
  customerPhone: z.string(),
  invoiceDate: z.string(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    rate: z.number(),
    taxRate: z.number(),
    total: z.number(),
  })),
  notes: z.string().optional(),
  recurring: z.boolean().optional(),
  subtotal: z.number(),
  totalTax: z.number(),
  grandTotal: z.number(),
});
export type GenerateInvoiceHtmlInput = z.infer<typeof GenerateInvoiceHtmlInputSchema>;

const GenerateInvoiceHtmlOutputSchema = z.object({
  html: z.string().describe('The complete, self-contained HTML document for the invoice.'),
});
export type GenerateInvoiceHtmlOutput = z.infer<typeof GenerateInvoiceHtmlOutputSchema>;

export async function generateInvoiceHtml(
  input: GenerateInvoiceHtmlInput
): Promise<GenerateInvoiceHtmlOutput> {
  return generateInvoiceHtmlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInvoiceHtmlPrompt',
  input: {schema: GenerateInvoiceHtmlInputSchema},
  output: {schema: GenerateInvoiceHtmlOutputSchema},
  prompt: `You are an expert web developer tasked with creating a professional, print-ready HTML invoice.
Generate a single, self-contained HTML5 document based on the provided JSON data.

**Key Requirements:**
1.  **Structure:** Use a standard HTML5 boilerplate (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`).
2.  **Styling:** All CSS must be contained within a single `<style>` tag in the `<head>`. Do not use external stylesheets or inline `style` attributes on elements.
3.  **Layout:** Create a clean, modern, two-column layout where company and customer details are clearly separated. Use flexbox or grid for layout. The design should be print-friendly (A4 size).
4.  **Content:**
    *   Clearly label and display "TAX INVOICE".
    *   Display all company details, customer details, and bank details (if provided).
    *   The items must be in a table with columns: "Item Description", "Qty", "Rate", "Taxable Amount", "GST (%)", and "Total".
    *   The "Taxable Amount" is quantity * rate.
    *   The final section must show the "Subtotal", "Total GST", and "Grand Total". The grand total should be prominently displayed.
    *   Include any "Notes" at the bottom.
5.  **Formatting:** Format all currency values with the Indian Rupee symbol (₹) and appropriate comma separators (e.g., ₹1,23,456.78). Format the invoice date to be human-readable (e.g., June 29, 2025).

**Invoice Data:**
Company Name: {{{companyName}}}
Company Address: {{{companyAddress}}}
Company GSTIN: {{{companyGstin}}}
Company Email: {{{companyEmail}}}
Company Phone: {{{companyPhone}}}

Customer Name: {{{customerName}}}
Customer Address: {{{customerAddress}}}
Customer Phone: {{{customerPhone}}}

Invoice Date: {{{invoiceDate}}}
Invoice Number: INV-{{#invoke "Date.now"}}{{/invoke}}

Bank Name: {{{bankName}}}
Account Number: {{{accountNumber}}}
IFSC Code: {{{ifscCode}}}

Notes: {{{notes}}}

Items:
{{#each items}}
- Name: {{this.name}}
  Quantity: {{this.quantity}}
  Rate: {{this.rate}}
  Tax Rate: {{this.taxRate}}%
  Total: {{this.total}}
{{/each}}

Totals:
Subtotal: {{{subtotal}}}
Total Tax: {{{totalTax}}}
Grand Total: {{{grandTotal}}}
`,
});

const generateInvoiceHtmlFlow = ai.defineFlow(
  {
    name: 'generateInvoiceHtmlFlow',
    inputSchema: GenerateInvoiceHtmlInputSchema,
    outputSchema: GenerateInvoiceHtmlOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate invoice HTML.');
    }
    return output;
  }
);
