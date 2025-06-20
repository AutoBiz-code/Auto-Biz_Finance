
// This file can be removed or repurposed.
// Specific feature server actions are now in src/actions/autobiz-features.ts
// AI related flows are in src/ai/flows/

"use server";

// Example of a simple server action if needed for other purposes.
export async function getAppName() {
  return "AutoBiz Finance";
}

// If you had old actions here like automateWhatsApp, generateGSTInvoice (old version), reconcileUPITransactions,
// they are now superseded by the new feature structure.
// - WhatsApp automation is partly covered by the AI WhatsApp Reply feature (Genkit flow).
// - GST invoicing is now GST Bill Generation (PDF).
// - UPI Reconciliation is part of Business Analysis.

console.log("src/actions/autobiz.ts loaded - consider removing or repurposing this file if all actions moved to autobiz-features.ts");
