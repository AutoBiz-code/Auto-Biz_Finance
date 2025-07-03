
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
    discountAmount: z.number(),
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
  taxAmountInWords: z.string(),
  // E-Invoice Details
  eInvoiceDetails: z.object({
    irn: z.string(),
    ackNo: z.string(),
    ackDate: z.string(),
    qrCodeUrl: z.string(),
  }).optional(),
  // Additional order details
  deliveryNote: z.string().optional(),
  termsOfPayment: z.string().optional(),
  referenceNoDate: z.string().optional(),
  otherReferences: z.string().optional(),
  buyersOrderNo: z.string().optional(),
  buyersOrderDate: z.string().optional(),
  dispatchDocNo: z.string().optional(),
  dispatchedThrough: z.string().optional(),
  destination: z.string().optional(),
});
export type GenerateInvoiceHtmlInput = z.infer<typeof GenerateInvoiceHtmlInputSchema>;

const GenerateInvoiceHtmlOutputSchema = z.object({
  html: z.string().describe('The complete, self-contained HTML document for the invoice.'),
});
export type GenerateInvoiceHtmlOutput = z.infer<typeof GenerateInvoiceHtmlOutputSchema>;

export async function generateInvoiceHtml(
  input: GenerateInvoiceHtmlInput
): Promise<GenerateInvoiceHtmlOutput> {
  const formattedInvoiceDate = format(new Date(input.invoiceDate), 'dd-MMM-yy');
  const formattedDueDate = format(new Date(input.dueDate), 'dd-MMM-yy');
  const formattedAckDate = input.eInvoiceDetails?.ackDate ? format(new Date(input.eInvoiceDetails.ackDate), 'dd-MMM-yy') : '';
  const formattedBuyersOrderDate = input.buyersOrderDate ? format(new Date(input.buyersOrderDate), 'dd-MMM-yy') : '';

  const enhancedInput = { 
    ...input, 
    formattedInvoiceDate, 
    formattedDueDate,
    eInvoiceDetails: input.eInvoiceDetails ? { ...input.eInvoiceDetails, formattedAckDate } : undefined,
    formattedBuyersOrderDate,
  };
  
  return generateInvoiceHtmlFlow(enhancedInput);
}

const prompt = ai.definePrompt({
  name: 'generateInvoiceHtmlPrompt',
  input: {schema: GenerateInvoiceHtmlInputSchema},
  output: {schema: GenerateInvoiceHtmlOutputSchema},
  prompt: `You are an expert web developer tasked with creating a precise, self-contained HTML invoice that replicates the provided e-invoice format. All CSS must be in a single <style> tag. Use Arial, 10px font. All tables must have thin, black, collapsed borders.

**Constraint Checklist & Confidence Score:**
1.  Single HTML file: Yes
2.  All CSS in one <style> tag: Yes
3.  Font is Arial, 10px: Yes
4.  All tables have thin, black, collapsed borders: Yes
5.  Layout matches the image structure exactly: Yes
Confidence Score: 5/5 - I will meet all constraints.

**HTML Structure Generation Plan:**

1.  **Main Container:** A div with a border.
2.  **Top Header:**
    *   A 'Tax Invoice' title, centered and bold.
    *   If \`eInvoiceDetails\` exists, add 'e-Invoice' on the right.
3.  **E-Invoice Details (Conditional):**
    *   If \`eInvoiceDetails\` exists, create a 2-column table.
    *   Left column: IRN, Ack No., Ack Date with labels and bold values from \`{{eInvoiceDetails}}\`.
    *   Right column: A 100x100px QR code image using \`{{eInvoiceDetails.qrCodeUrl}}\`.
4.  **Party Details:**
    *   A 2-column table.
    *   **Left Column (Seller):**
        *   "{{companyName}}" (bold, 12px).
        *   Address, GSTIN (bold), E-mail, Contact.
    *   **Right Column (Buyer/Consignee):**
        *   "Consignee (Ship to)": Name, Address, GSTIN (bold).
        *   "Buyer (Bill to)": Name, Address, GSTIN (bold).
5.  **Invoice Metadata:**
    *   A 4-column table for: Invoice No/Date, Delivery Note, Mode/Terms of Payment, Ref No & Date, etc. Populate with corresponding input fields like \`{{invoiceNumber}}\`, \`{{formattedInvoiceDate}}\`, \`{{deliveryNote}}\`, \`{{termsOfPayment}}\`, etc.
6.  **Items Table:**
    *   Columns: 'Sl. No.', 'Description of Goods and Services', 'HSN/SAC', 'Quantity', 'Rate', 'per', 'Amount'.
    *   Iterate through the \`items\` array. For each item:
        *   Create a row. Populate with description, HSN, quantity, rate, unit, and amount.
        *   The 'Amount' is \`{{this.amount}}\`. Format all numbers to 2 decimal places.
    *   After items, add a row for "FREIGHT & CARTAGE" if \`{{shippingCharges}}\` > 0.
7.  **Totals Section (Below Items):**
    *   A row spanning all columns.
    *   Right-aligned: "CGST Output @9%", "SGST Output @9%", "Total".
    *   Populate with \`{{totalCgst}}\`, \`{{totalSgst}}\`, and \`{{grandTotal}}\`.
8.  **Amounts in Words:**
    *   Full-width row: "Amount Chargeable (in words)".
    *   Next line, bold: "{{grandTotalInWords}} Only".
9.  **Tax Summary Table:**
    *   A full-width table. Columns: "HSN/SAC", "Taxable Value", "CGST Rate", "CGST Amount", "SGST/UTGST Rate", "SGST/UTGST Amount", "Total Tax Amount".
    *   Iterate through \`items\`. Add a row for each with its HSN, taxableValue, taxRate/2, cgst, taxRate/2, sgst, and total tax for the item.
    *   Add a "Total" row summarizing \`subtotal\`, \`totalCgst\`, \`totalSgst\`, and \`totalTax\`.
10. **Tax in Words:**
    *   Full-width row: "Tax Amount (in words)".
    *   Next line, bold: "{{taxAmountInWords}} Only".
11. **Final Section:**
    *   A 2-column table.
    *   **Left Column:** Declaration text.
    *   **Right Column:** Company's Bank Details, then "for {{companyName}}", and finally "(Authorised Signatory)".
12. **Footer:**
    *   Centered text: "This is a Computer Generated Invoice".

**CSS Styling:**
*   \`body { font-family: Arial, sans-serif; font-size: 10px; }\`
*   \`table { border-collapse: collapse; width: 100%; }\`
*   \`th, td { border: 1px solid black; padding: 4px; vertical-align: top; }\`
*   \`.bold { font-weight: bold; }\`
*   \`.text-center { text-align: center; }\`
*   \`.text-right { text-align: right; }\`
*   \`.no-border { border: none; }\`
*   \`.font-12 { font-size: 12px; }\`
*   All monetary values must be formatted to two decimal places.
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
