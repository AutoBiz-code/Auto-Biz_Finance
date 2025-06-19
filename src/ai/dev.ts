import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-upi-transactions.ts';
import '@/ai/flows/flag-reconciliation-discrepancies.ts';