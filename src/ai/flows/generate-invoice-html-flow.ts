
'use server';
/**
 * @fileOverview A Genkit flow to generate a professional HTML invoice from structured data, mimicking a TallyPrime format.
 *
 * - generateInvoiceHtml - A function that generates an HTML string for an invoice.
 * - GenerateInvoiceHtmlInput - The input type for the generateInvoiceHtml function.
 * - GenerateInvoiceHtmlOutput - The return type for the generateInvoiceHtml function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { format } from 'date-fns';

const GenerateInvoiceHtmlInputSchema = z.object({
  userId: z.string(),
  invoiceNumber: z.string(),
  invoiceDate: z.string(),
  dueDate: z.string(),
  companyName: z.string(),
  companyAddress: z.string(),
  companyGstin: z.string(),
  companyEmail: z.string().optional(),
  companyPhone: z.string().optional(),
  customerName: z.string(),
  customerGstin: z.string().optional(),
  billingAddress: z.string(),
  shippingAddress: z.string(),
  items: z.array(z.object({
    description: z.string(),
    hsnSac: z.string(),
    quantity: z.number(),
    unit: z.string(),
    rate: z.number(),
    amount: z.number(),
    taxableValue: z.number(),
    taxRate: z.number(),
    cgst: z.number(),
    sgst: z.number(),
  })),
  shippingCharges: z.number(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  branch: z.string().optional(),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  subtotal: z.number(),
  totalTax: z.number(),
  totalCgst: z.number(),
  totalSgst: z.number(),
  grandTotal: z.number(),
  grandTotalInWords: z.string(),
});
export type GenerateInvoiceHtmlInput = z.infer<typeof GenerateInvoiceHtmlInputSchema>;

const GenerateInvoiceHtmlOutputSchema = z.object({
  html: z.string().describe('The complete, self-contained HTML document for the invoice.'),
});
export type GenerateInvoiceHtmlOutput = z.infer<typeof GenerateInvoiceHtmlOutputSchema>;

export async function generateInvoiceHtml(
  input: GenerateInvoiceHtmlInput
): Promise<GenerateInvoiceHtmlOutput> {
  // Pre-format dates here to ensure consistency
  const formattedInvoiceDate = format(new Date(input.invoiceDate), 'dd-MMM-yy');
  
  const enhancedInput = { ...input, formattedInvoiceDate };
  
  return generateInvoiceHtmlFlow(enhancedInput);
}

const prompt = ai.definePrompt({
  name: 'generateInvoiceHtmlPrompt',
  input: {schema: GenerateInvoiceHtmlInputSchema},
  output: {schema: GenerateInvoiceHtmlOutputSchema},
  prompt: `You are an expert web developer specializing in creating pixel-perfect HTML invoices that precisely replicate the TallyPrime GST invoice format. Generate a single, self-contained HTML5 document. All CSS must be inside a single '<style>' tag in the '<head>'. Use a common sans-serif font like Arial, size 10px. Ensure all tables use thin, black, collapsed borders.

**Layout and Content Specification:**

1.  **Main Header:**
    *   Create a main header with "TAX INVOICE" centered and bold.
    *   Below it, add "ORIGINAL" centered.

2.  **Company & Invoice Details (Top Section):**
    *   This section is a table with 2 columns.
    *   **Left Column:**
        *   "{{companyName}}" (bold, font-size 12px).
        *   "{{companyAddress}}".
        *   "E-mail: {{companyEmail}}".
        *   "GSTIN: {{companyGstin}}" (bold).
    *   **Right Column:**
        *   A nested table with 2 columns.
        *   Rows for: "INVOICE NO.", "INVOICE DATE", "Contact No".
        *   Populate with: "{{invoiceNumber}}", "{{formattedInvoiceDate}}", "{{companyPhone}}".

3.  **Buyer Details (Middle Section):**
    *   A table with 2 columns.
    *   **Left Column (Bill To):**
        *   "Bill To:-" (label).
        *   "{{customerName}}" (bold).
        *   "{{billingAddress}}".
        *   "GSTIN: {{customerGstin}}" (bold).
    *   **Right Column (Place of Supply):**
        *   "Place of Supply:-" (label).
        *   "{{customerName}}" (bold).
        *   "{{shippingAddress}}".
        *   "GSTIN: {{customerGstin}}" (bold).

4.  **Items Table:**
    *   A table with columns: "Sr. No.", "Description of Goods/Services", "HSN/SAC", "UNIT", "Qty", "Rate", "Amount (Rs.)".
    *   For each item in \`items\`:
        *   Create a row. "Amount (Rs.)" is \`{{this.amount}}\`. Format numbers to 2 decimal places.
    *   After all items, add a row for "FREIGHT CHARGES". It should span the description column, and the charge \`{{shippingCharges}}\` should be in the amount column.

5.  **Footer Section:**
    *   A main table with 2 columns.
    *   **Left Column (Bank Details):**
        *   A nested table showing "Bank Name", "Bank A/C Number", "IFSC Code", "Branch" with their values ({{{bankName}}}, {{{accountNumber}}}, etc.).
        *   Below the bank table, add "RUPEES (IN WORDS):".
        *   On the next line, in bold, add "{{grandTotalInWords}} ONLY".
    *   **Right Column (Totals):**
        *   A nested table with rows for: "Taxable Value", "SGST Output @9%", "CGST Output @9%", "IGST Output @18%", "Rounded Off (+-)", and "Grand Total" (bold).
        *   Populate "Taxable Value" with \`{{subtotal}}\`.
        *   Populate "SGST" and "CGST" with \`{{totalSgst}}\` and \`{{totalCgst}}\`.
        *   Leave IGST blank. Leave Rounded Off blank.
        *   Populate "Grand Total" with \`{{grandTotal}}\` (bold).

6.  **Tax Summary Table:**
    *   A full-width table with columns: "HSN/SAC", "Taxable Value", "Rate", "SGST AMT", "CGST AMT", "IGST AMT", "Total Tax Amount".
    *   For each item in \`items\`, add a row with its HSN/SAC, taxableValue, taxRate%, sgst, and cgst amounts.
    *   A final "Total" row summarizing the `subtotal`, `totalSgst`, and `totalCgst`.

7.  **Final Section:**
    *   A table with 2 columns.
    *   **Left Column:** "Note: {{notes}}".
    *   **Right Column:** "for {{companyName}}" and below it, "(Authorised Signatory)".
    *   At the very bottom, centered: "This is a Computer Generated Invoice".

**Styling:**
*   Use thin (1px), black, collapsed borders for ALL tables and cells.
*   Ensure padding is minimal (e.g., 2px 4px) to replicate the dense Tally look.
*   Match text alignment (right-align all numbers/amounts).
*   Use bold font weight as specified.
*   All monetary values should be formatted to two decimal places.
`
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

    