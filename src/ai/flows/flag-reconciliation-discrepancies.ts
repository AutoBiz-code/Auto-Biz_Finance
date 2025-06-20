// This flow may no longer be directly used if UPI reconciliation is part of the new "Business Analysis" feature.
// Consider archiving or removing if not part of the current core feature set.
'use server';
/**
 * @fileOverview This file contains the Genkit flow for flagging reconciliation discrepancies in UPI transactions.
 *
 * - flagReconciliationDiscrepancies - A function that triggers the discrepancy flagging process.
 * - FlagReconciliationDiscrepanciesInput - The input type for the flagReconciliationDiscrepancies function.
 * - FlagReconciliationDiscrepanciesOutput - The return type for the flagReconciliationDiscrepancies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagReconciliationDiscrepanciesInputSchema = z.object({
  upiTransactionData: z
    .string()
    .describe('Unstructured UPI transaction data to be analyzed.'),
});
export type FlagReconciliationDiscrepanciesInput = z.infer<
  typeof FlagReconciliationDiscrepanciesInputSchema
>;

const FlagReconciliationDiscrepanciesOutputSchema = z.object({
  discrepanciesFound: z
    .boolean()
    .describe('Indicates whether any reconciliation discrepancies were found.'),
  discrepancyDetails: z
    .string()
    .describe('Details of the reconciliation discrepancies found, if any.'),
});
export type FlagReconciliationDiscrepanciesOutput = z.infer<
  typeof FlagReconciliationDiscrepanciesOutputSchema
>;

export async function flagReconciliationDiscrepancies(
  input: FlagReconciliationDiscrepanciesInput
): Promise<FlagReconciliationDiscrepanciesOutput> {
  return flagReconciliationDiscrepanciesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flagReconciliationDiscrepanciesPrompt',
  input: {schema: FlagReconciliationDiscrepanciesInputSchema},
  output: {schema: FlagReconciliationDiscrepanciesOutputSchema},
  prompt: `You are an AI assistant that helps in identifying reconciliation discrepancies in UPI transactions.

  Analyze the following UPI transaction data and determine if there are any discrepancies that need to be flagged. Provide a clear explanation of any discrepancies found.

  UPI Transaction Data: {{{upiTransactionData}}}

  Based on your analysis, determine if there are any reconciliation discrepancies and provide a detailed explanation.
`,
});

const flagReconciliationDiscrepanciesFlow = ai.defineFlow(
  {
    name: 'flagReconciliationDiscrepanciesFlow',
    inputSchema: FlagReconciliationDiscrepanciesInputSchema,
    outputSchema: FlagReconciliationDiscrepanciesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to flag reconciliation discrepancies.");
    }
    return output;
  }
);
