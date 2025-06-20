
'use server';
/**
 * @fileOverview A Genkit flow to generate WhatsApp replies using an AI model.
 *
 * - generateWhatsAppReply - A function that generates a reply based on business category and customer message.
 * - GenerateWhatsAppReplyInput - The input type for the generateWhatsAppReply function.
 * - GenerateWhatsAppReplyOutput - The return type for the generateWhatsAppReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWhatsAppReplyInputSchema = z.object({
  businessCategory: z
    .string()
    .describe('The category or type of the business (e.g., E-commerce Store, Local Bakery).'),
  customerMessage: z
    .string()
    .describe('The message received from the customer on WhatsApp.'),
});
export type GenerateWhatsAppReplyInput = z.infer<typeof GenerateWhatsAppReplyInputSchema>;

const GenerateWhatsAppReplyOutputSchema = z.object({
  reply: z.string().describe('The AI-generated reply to the customer message.'),
});
export type GenerateWhatsAppReplyOutput = z.infer<typeof GenerateWhatsAppReplyOutputSchema>;

export async function generateWhatsAppReply(
  input: GenerateWhatsAppReplyInput
): Promise<GenerateWhatsAppReplyOutput> {
  return whatsAppReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'whatsAppReplyPrompt',
  input: {schema: GenerateWhatsAppReplyInputSchema},
  output: {schema: GenerateWhatsAppReplyOutputSchema},
  prompt: `You are an expert customer service assistant.
  Generate a professional and helpful WhatsApp reply for a business in the '{{{businessCategory}}}' sector to the following customer message:
  '{{{customerMessage}}}'

  The reply should be concise, empathetic, and address the customer's query or statement appropriately.
  If the customer's message is unclear, ask a polite clarifying question.
  Do not make up information if you don't have it.
  Keep the tone friendly and professional.`,
});

const whatsAppReplyFlow = ai.defineFlow(
  {
    name: 'whatsAppReplyFlow',
    inputSchema: GenerateWhatsAppReplyInputSchema,
    outputSchema: GenerateWhatsAppReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a reply.');
    }
    return output;
  }
);
