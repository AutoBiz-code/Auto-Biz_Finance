
"use server";

import { generateInvoiceHtml, type GenerateInvoiceHtmlInput } from "@/ai/flows/generate-invoice-html-flow";
import { numberToWords } from "@/lib/number-to-words";
import axios from 'axios';

export interface GstInvoiceItem {
  description: string;
  hsnSac: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number; // Percentage
  taxRate: number; // Percentage
}

export interface GstInvoiceParams {
  userId: string;
  // Invoice Header
  invoiceNumber: string;
  invoiceDate: string; // ISO string date
  dueDate: string; // ISO string date
  // Company Details
  companyName: string;
  companyAddress: string;
  companyGstin: string;
  companyEmail?: string;
  companyPhone?: string;
  // Customer Details
  customerName: string;
  customerGstin?: string;
  customerPhone?: string;
  customerEmail?: string;
  billingAddress: string;
  shippingAddress: string;
  // Dispatch & Order Details
  deliveryNote?: string;
  termsOfPayment?: string;
  referenceNoDate?: string;
  otherReferences?: string;
  buyersOrderNo?: string;
  buyersOrderDate?: string; // ISO string date
  dispatchDocNo?: string;
  dispatchedThrough?: string;
  destination?: string;
  termsOfDelivery?: string;
  // Items
  items: GstInvoiceItem[];
  // Additional Charges
  shippingCharges: number;
  // Bank Details
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branch?: string;
  // Optional Fields
  notes?: string;
  termsAndConditions?: string;
}

export async function generateGstPdfAction(params: GstInvoiceParams) {
  console.info("Server Action: Attempting to generate GST invoice HTML.", { userId: params.userId, invoiceNumber: params.invoiceNumber });
  try {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    const cgstSgstRate = 9; // Assuming 9% CGST and 9% SGST for now
    let totalCgst = 0;
    let totalSgst = 0;

    const processedItems = params.items.map(item => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const discountPercent = Number(item.discount) || 0;
      const taxRatePercent = Number(item.taxRate) || 0;

      const amount = quantity * rate;
      const discountAmount = amount * (discountPercent / 100);
      const taxableValue = amount - discountAmount;
      const taxAmount = taxableValue * (taxRatePercent / 100);
      
      subtotal += taxableValue;
      totalTax += taxAmount;
      totalDiscount += discountAmount;

      const itemCgst = taxAmount / 2;
      const itemSgst = taxAmount / 2;
      totalCgst += itemCgst;
      totalSgst += itemSgst;

      return {
        ...item,
        amount,
        taxableValue,
        cgst: itemCgst,
        sgst: itemSgst,
        discountAmount: discountAmount,
      };
    });

    const grandTotal = subtotal + totalTax + params.shippingCharges;
    const grandTotalInWords = numberToWords(Math.round(grandTotal));
    const taxAmountInWords = numberToWords(Math.round(totalTax));

    let eInvoiceDetails;
    if (grandTotal >= 50000) {
        console.info("Grand total >= 50,000 INR. Generating simulated E-Invoice details.");
        const eWayBillResult = await generateEWayBillAction({
            invoiceId: params.invoiceNumber,
            companyId: 'mock-company-id'
        });

        if (eWayBillResult.success) {
            eInvoiceDetails = {
                irn: eWayBillResult.irn,
                ackNo: `ACK${Date.now()}`,
                ackDate: new Date().toISOString(),
                qrCodeUrl: eWayBillResult.qrCode,
            };
        } else {
            console.warn("Failed to generate E-Way Bill details, proceeding without them.");
        }
    }


    const flowInput: GenerateInvoiceHtmlInput = {
      ...params,
      items: processedItems,
      subtotal,
      totalTax,
      totalDiscount,
      totalCgst,
      totalSgst,
      grandTotal,
      grandTotalInWords,
      taxAmountInWords,
      eInvoiceDetails,
    };
    
    const result = await generateInvoiceHtml(flowInput);
    
    return { success: true, htmlContent: result.html };
  } catch (error: any) {
    console.error("Error in generateGstPdfAction", { errorMessage: error.message, stack: error.stack, params: params });
    return { success: false, error: error.message || "An unknown error occurred during PDF generation." };
  }
}


interface StockUpdateParams {
  userId: string;
  itemName: string;
  quantity: number;
  price: number;
  batchNumber?: string;
  expiryDate?: string;
  location?: string;
}

export async function updateStockAction(params: StockUpdateParams) {
  console.info("Server Action: Attempting to update stock.", { userId: params.userId, item: params.itemName });
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (Math.random() < 0.1) throw new Error("Simulated Firestore Error during stock update");
    return { success: true, message: `Stock for ${params.itemName} updated successfully.` };
  } catch (error: any) {
    console.error("Error in updateStockAction", { errorMessage: error.message, stack: error.stack, params: params });
    return { success: false, error: error.message || "An unknown error occurred during stock update." };
  }
}


interface BusinessAnalysisParams {
  userId: string;
  razorpayKey?: string;
  whatsappKey?: string;
  botpressKey?: string;
}

export async function analyzeBusinessDataAction(params: BusinessAnalysisParams) {
  console.info("Server Action: Attempting to analyze business data.", { userId: params.userId, hasRazorpay: !!params.razorpayKey, hasWhatsApp: !!params.whatsappKey, hasBotpress: !!params.botpressKey });
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (Math.random() < 0.1) throw new Error("Simulated Business Analysis API Error");
    
    const analysisData = {
      payments: { total_transactions: Math.floor(Math.random() * 100), total_volume: Math.floor(Math.random() * 50000) },
      messaging: { messages_processed: Math.floor(Math.random() * 1000) },
      automation: { tasks_completed: Math.floor(Math.random() * 500) },
      summary: "Overall business performance is positive with good engagement."
    };
    return { success: true, message: "Business data analysis completed.", analysisData };
  } catch (error: any) {
    console.error("Error in analyzeBusinessDataAction", { errorMessage: error.message, stack: error.stack, params: params });
    return { success: false, error: error.message || "An unknown error occurred during business analysis." };
  }
}

// --- NEW ACTIONS for Payroll and Backup ---

interface EmployeeParams {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  department: string;
  salary: number;
}

export async function addEmployeeAction(params: EmployeeParams) {
  console.info("Server Action: Adding new employee.", { name: params.name });
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (Math.random() < 0.1) throw new Error("Simulated error adding employee.");
    return { success: true, message: "Employee added." };
  } catch (error: any) {
    console.error("Error in addEmployeeAction", { errorMessage: error.message, stack: error.stack, params: params });
    return { success: false, error: error.message || "An unknown error occurred while adding employee." };
  }
}

interface ProcessPayrollParams {
  employeeId: string;
  salary: number; // Base salary
}

// Updated to match the logic in the user's brief
export async function processPayrollAction(params: ProcessPayrollParams) {
  console.info("Server Action: Processing payroll for employee.", { employeeId: params.employeeId });
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (Math.random() < 0.1) throw new Error("Simulated error processing payroll.");
    
    const deductions = { PF: 1800, ESI: 750 };
    const netAmount = params.salary - Object.values(deductions).reduce((a, b) => a + b, 0);
    const taxDeducted = 2000; // Simulated
    const finalAmount = netAmount - taxDeducted;

    return { 
      success: true, 
      message: `Payroll processed. Net pay: ${finalAmount.toLocaleString('en-IN')} INR`,
      payslipUrl: "https://example.com/payslip.pdf" // Placeholder
    };
  } catch (error: any) {
    console.error("Error in processPayrollAction", { errorMessage: error.message, stack: error.stack, params: params });
    return { success: false, error: error.message || "An unknown error occurred while processing payroll." };
  }
}

interface CreateBackupParams {
  userId: string;
}

export async function createBackupAction(params: CreateBackupParams) {
  console.info("Server Action: Creating backup for user.", { userId: params.userId });
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (Math.random() < 0.1) throw new Error("Simulated backup creation error.");
    const newId = `bkp_${crypto.randomUUID()}`;
    const size = (Math.random() * 5 + 12).toFixed(1); // 12.0 - 17.0 MB
    return { success: true, backupId: newId, createdAt: new Date().toISOString(), size: `${size} MB` };
  } catch (error: any) {
    console.error("Error in createBackupAction", { errorMessage: error.message, stack: error.stack, params: params });
    return { success: false, error: error.message || "An unknown error occurred during backup creation." };
  }
}

interface RestoreBackupParams {
  backupId: string;
}

export async function restoreBackupAction(params: RestoreBackupParams) {
  console.info("Server Action: Restoring from backup.", { backupId: params.backupId });
  try {
    await new Promise(resolve => setTimeout(resolve, 3000));
    if (Math.random() < 0.1) throw new Error("Simulated backup restore error.");
    return { success: true, message: "Restore process started successfully." };
  } catch (error: any) {
    console.error("Error in restoreBackupAction", { errorMessage: error.message, stack: error.stack, params: params });
    return { success: false, error: error.message || "An unknown error occurred during backup restore." };
  }
}

// --- NEW ACTION for GST Filing ---
interface FileGstReturnParams {
  gstin: string;
  period: string; // e.g. "10-2023" for Oct 2023
}

export async function fileGstReturnAction(params: FileGstReturnParams) {
  console.info("Server Action: Filing GSTR-1.", { gstin: params.gstin, period: params.period });
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (Math.random() < 0.1) throw new Error("Simulated GSTN communication error.");
    
    const arn = `ARN${Date.now()}${Math.floor(Math.random() * 100)}`;
    return { success: true, message: `GSTR-1 successfully filed. Acknowledgement Reference Number (ARN): ${arn}` };
  } catch (error: any) {
    console.error("Error in fileGstReturnAction", { errorMessage: error.message, stack: error.stack, params: params });
    return { success: false, error: error.message || "An unknown error occurred during GST filing." };
  }
}

// --- NEW ACTION for API Keys ---
interface ApiKeyParams {
  userId: string;
  razorpayKey?: string;
  whatsappKey?: string;
  botpressKey?: string;
}

export async function saveApiKeysAction(params: ApiKeyParams) {
  console.info("Server Action: Saving API Keys for user.", { userId: params.userId, hasRazorpay: !!params.razorpayKey, hasWhatsApp: !!params.whatsappKey, hasBotpress: !!params.botpressKey });
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (Math.random() < 0.1) throw new Error("Simulated error saving API keys.");
    return { success: true, message: "API connections saved successfully." };
  } catch (error: any) {
    console.error("Error in saveApiKeysAction", { errorMessage: error.message, stack: error.stack, params: params });
    return { success: false, error: error.message || "An unknown error occurred while saving API keys." };
  }
}

// --- NEW ACTION for E-Way Bill ---
interface EWayBillParams {
    invoiceId: string;
    companyId: string;
}
export async function generateEWayBillAction(params: EWayBillParams) {
    console.info("Server Action: Generating E-Way Bill for invoice:", { invoiceId: params.invoiceId });
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (Math.random() < 0.1) throw new Error("Simulated E-Way Bill API error.");

        const eWayBillNumber = 'EWB' + Date.now();
        const irn = 'IRN' + Date.now();
        const qrCode = 'https://placehold.co/100x100.png'; // Placeholder QR code

        return {
            success: true,
            message: `E-Way Bill ${eWayBillNumber} and IRN generated.`,
            eWayBillNumber,
            irn,
            qrCode
        };
    } catch (error: any) {
        console.error("Error in generateEWayBillAction", { errorMessage: error.message, stack: error.stack, params: params });
        return { success: false, error: error.message || "An unknown error occurred during E-Way Bill generation." };
    }
}


// --- NEW ACTION for Report Export ---
interface ExportParams {
    reportType: string;
    format: 'PDF' | 'Excel';
}
export async function exportReportAction(params: ExportParams) {
    console.info(`Server Action: Exporting ${params.reportType} report as ${params.format}`);
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (Math.random() < 0.1) throw new Error("Simulated report export error.");

        const fileExtension = params.format === 'PDF' ? 'pdf' : 'xlsx';
        return {
            success: true,
            message: "Report has been generated and is ready for download.",
            url: `https://example.com/export/report_${Date.now()}.${fileExtension}`
        };
    } catch (error: any) {
        console.error("Error in exportReportAction", { errorMessage: error.message, stack: error.stack, params: params });
        return { success: false, error: error.message || "An unknown error occurred during report export." };
    }
}

// --- NEW ACTION for Bulk Reconciliation ---
interface ReconcileTransactionsParams {
    transactionIds: string[];
}
export async function reconcileTransactionsAction(params: ReconcileTransactionsParams) {
    console.info("Server Action: Reconciling multiple transactions.", { count: params.transactionIds.length });
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (Math.random() < 0.1) throw new Error("Simulated bulk reconciliation error.");
        return { success: true, message: `${params.transactionIds.length} transactions have been reconciled.` };
    } catch (error: any) {
        console.error("Error in reconcileTransactionsAction", { errorMessage: error.message, stack: error.stack, params: params });
        return { success: false, error: error.message || "An unknown error occurred during bulk reconciliation." };
    }
}

// --- LIVE E-INVOICE & E-WAY BILL ACTIONS ---

interface LiveEInvoiceItem {
    description: string;
    hsn: string;
    quantity: number;
    unitPrice: number;
    gstRate: number;
    taxable: number;
    total: number;
    cgst: number;
    sgst: number;
    igst: number;
}

interface LiveEInvoiceParams {
    gstin: string; // Seller GSTIN from your app's config
    invoiceNumber: string;
    buyerGstin: string;
    buyerName: string;
    buyerAddr: string;
    items: LiveEInvoiceItem[];
}

export async function liveGenerateEInvoiceAction(data: LiveEInvoiceParams) {
    console.info("Server Action: Attempting to generate live E-Invoice.", { invoiceNumber: data.invoiceNumber });
    const { gstin, invoiceNumber, buyerGstin, buyerName, buyerAddr, items } = data;
    
    const username = process.env.GST_EINVOICE_USERNAME;
    const password = process.env.GST_EINVOICE_PASSWORD;

    if (!username || !password) {
        return { success: false, error: "E-Invoice API credentials are not configured on the server. Please set them in the .env file." };
    }

    // Following user guide to use sandbox URL.
    const url = 'https://einv-apisandbox.nic.in/version1.03/invoice'; 
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    
    const payload = {
        "Version": "1.1",
        "TranDtls": { "TaxSch": "GST", "SupTyp": "B2B" },
        "DocDtls": { "Typ": "INV", "No": invoiceNumber, "Dt": new Date().toLocaleDateString('en-IN', {day: '2-digit', month: '2-digit', year: 'numeric'}) },
        "SellerDtls": { "Gstin": gstin, "LglNm": "AutoBiz Finance", "Addr1": "Gurugram, Haryana" },
        "BuyerDtls": { "Gstin": buyerGstin, "LglNm": buyerName, "Addr1": buyerAddr },
        "ItemList": items.map((item, index) => ({
            "SlNo": (index + 1).toString(),
            "PrdDesc": item.description,
            "HsnCd": item.hsn,
            "Qty": item.quantity,
            "Unit": "NOS",
            "UnitPrice": item.unitPrice,
            "TotAmt": item.taxable,
            "AssAmt": item.taxable,
            "GstRt": item.gstRate,
            "CgstAmt": item.cgst,
            "SgstAmt": item.sgst,
            "IgstAmt": item.igst,
            "TotItemVal": item.total
        })),
        "ValDtls": {
            "AssVal": items.reduce((acc, i) => acc + i.taxable, 0),
            "CgstVal": items.reduce((acc, i) => acc + i.cgst, 0),
            "SgstVal": items.reduce((acc, i) => acc + i.sgst, 0),
            "IgstVal": items.reduce((acc, i) => acc + i.igst, 0),
            "TotInvVal": items.reduce((acc, i) => acc + i.total, 0)
        }
    };
    
    try {
        const requestBody = { Data: Buffer.from(JSON.stringify(payload)).toString('base64') };
        const response = await axios.post(url, requestBody, { 
            headers: { 
                'Authorization': `Basic ${auth}`, 
                'Content-Type': 'application/json',
                'gstin': gstin 
            }
        });
        
        if (response.data.Status === "0") {
             return { success: false, error: `API Error: ${response.data.ErrorDetails[0].ErrorMessage}` };
        }
        
        const decodedData = JSON.parse(Buffer.from(response.data.Data, 'base64').toString('utf8'));
        return { success: true, irn: decodedData.Irn, qrCode: decodedData.SignedQRCode };
    } catch (error: any) {
        console.error("Error in liveGenerateEInvoiceAction:", error.response?.data || error.message);
        const apiError = error.response?.data?.ErrorDetails?.[0]?.ErrorMessage || 'An unknown API error occurred. Check credentials and payload.';
        return { success: false, error: `e-Invoice generation failed: ${apiError}` };
    }
}

interface LiveEWayBillParams {
    irn: string;
    vehicleNo: string;
}

export async function liveGenerateEWayBillAction(data: LiveEWayBillParams) {
    console.info("Server Action: Attempting to generate live E-Way Bill from IRN.", { irn: data.irn });
    const { irn, vehicleNo } = data;

    const username = process.env.GST_EWAYBILL_USERNAME;
    const password = process.env.GST_EWAYBILL_PASSWORD;

    if (!username || !password) {
        return { success: false, error: "E-Way Bill API credentials are not configured on the server. Please set them in the .env file." };
    }
    
    const url = 'https://ewaybillgst.gov.in/api/ewb/registration';
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    const payload = { 
        "Irn": irn, 
        "VehicleNo": vehicleNo, 
        "TransDocNo": `TD${Date.now()}`, 
        "TransDocDt": new Date().toLocaleDateString('en-IN', {day: '2-digit', month: '2-digit', year: 'numeric'})
    };

    try {
        const response = await axios.post(url, payload, {
            headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' }
        });
        
        if (response.data.status === "0") {
             return { success: false, error: `API Error: ${response.data.error.message}` };
        }
        
        return { success: true, ewbNo: response.data.EwbNo, validity: response.data.Validity };
    } catch (error: any) {
        console.error("Error in liveGenerateEWayBillAction", { errorMessage: error.response?.data || error.message });
        return { success: false, error: 'E-Way Bill generation failed. Please check credentials and vehicle details.' };
    }
}


// --- NEW ACTION for IP Check ---
export async function getOutboundIpAction() {
  console.info("Server Action: Attempting to get outbound IP address.");
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    const ip = response.data.ip;
    if (ip) {
      return { success: true, ip: ip };
    } else {
      return { success: false, error: "Could not retrieve IP from the response." };
    }
  } catch (error: any) {
    console.error("Error in getOutboundIpAction", { errorMessage: error.message });
    return { success: false, error: "Failed to fetch outbound IP. Check server logs." };
  }
}
