
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
  prompt: `You are an expert web developer creating a professional HTML invoice that precisely replicates a TallyPrime e-invoice format. Generate a single, self-contained HTML5 document. All CSS must be inside a single '<style>' tag in the '<head>'. Use a common sans-serif font like Arial.

**Layout and Content Specification:**

1.  **Title:** "Tax Invoice" centered and bold at the top.

2.  **Header:** A top section with:
    *   **Left:** "IRN:", "Ack No.:", "Ack Date:" (leave values blank).
    *   **Right:** An "e-Invoice" section with a 100x100px bordered div as a QR code placeholder.

3.  **Party & Invoice Details (Two-column layout):**
    *   **Left Column (Supplier & Customer):**
        *   Supplier: {{{companyName}}}, {{{companyAddress}}}, "GSTIN/UIN: {{{companyGstin}}}".
        *   Consignee (Ship to): {{{customerName}}}, {{{customerAddress}}}.
        *   Buyer (Bill to): {{{customerName}}}, {{{customerAddress}}}.
    *   **Right Column (Invoice Metadata Table):**
        *   A table with rows for: "Invoice No.", "Dated", "Delivery Note", "Mode/Terms of Payment", "Reference No. & Date", "Buyer's Order No.", "Dispatch Doc No.", "Dispatched through", "Terms of Delivery".
        *   Populate "Invoice No." with a unique ID you generate.
        *   Populate "Dated" with {{{invoiceDate}}} formatted as DD-Mon-YY.
        *   If bank details ({{{bankName}}}, etc.) are provided, list them under "Mode/Terms of Payment".
        *   Leave other fields blank.

4.  **Items Table:**
    *   Columns: "Sl No.", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Amount".
    *   For each item in the items array:
        *   Create a row. Use a placeholder for "HSN/SAC".
        *   Format Quantity as "{{this.quantity}} No".
        *   "Amount" is quantity * rate.
    *   **After each item's main row**, if there is tax, add two sub-rows for CGST and SGST. Display their respective amounts under the "Amount" column. Assume the item's total tax should be split equally between CGST and SGST.
    *   **Total Row:** Display total quantity and the {{{grandTotal}}} (formatted as #,##,###.## Rupees). Add "E. & O.E" to the right.

5.  **Totals Section:**
    *   "Amount Chargeable (in words)": Write out the {{{grandTotal}}} in Indian English words.
    *   **Tax Summary Table:** Create a summary table below with columns: "HSN/SAC", "Taxable Value", "Central Tax (Rate, Amount)", "State Tax (Rate, Amount)", "Total Tax Amount".
        *   Summarize the totals for all items. {{{subtotal}}} is the total taxable value. {{{totalTax}}} should be split into Central and State tax amounts. The tax *rate* for Central/State should be half of the item's taxRate.
    *   "Tax Amount (in words):": Write out the {{{totalTax}}} in Indian English words.

6.  **Footer:**
    *   **Declaration:** "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct."
    *   **Signature:** On the right, "for {{{companyName}}}" and "Authorised Signatory" below it.
    *   **Final Line:** Centered at the bottom: "This is a Computer Generated Invoice".

**Styling:**
*   Use thin, black, collapsed borders for all tables.
*   Match text alignment (e.g., right-align numbers) and font-weight (bold titles).

**Invoice Data:**
Company Name: {{{companyName}}}
Company Address: {{{companyAddress}}}
Company GSTIN: {{{companyGstin}}}
Customer Name: {{{customerName}}}
Customer Address: {{{customerAddress}}}
Invoice Date: {{{invoiceDate}}}
Bank Details: {{{bankName}}}, {{{accountNumber}}}, {{{ifscCode}}}
{{#each items}}
- Item: {{this.name}}, Qty: {{this.quantity}}, Rate: {{this.rate}}, Tax Rate: {{this.taxRate}}%
{{/each}}
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
