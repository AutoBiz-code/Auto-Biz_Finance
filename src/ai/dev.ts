import { config } from 'dotenv';
config();

// Remove or comment out old flow imports if they are no longer used
// import '@/ai/flows/categorize-upi-transactions.ts';
// import '@/ai/flows/flag-reconciliation-discrepancies.ts';

import '@/ai/flows/generate-whatsapp-reply-flow.ts';
import '@/ai/flows/generate-invoice-html-flow.ts';
