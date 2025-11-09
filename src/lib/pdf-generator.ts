import jsPDF from "jspdf";

interface CompanyInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerEmail?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
}

interface ReceiptData {
  receiptNumber: string;
  date: string;
  customerName?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
}

interface PayrollData {
  employeeName: string;
  employeeNumber: string;
  period: string;
  basicSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
}

export const generateInvoicePDF = (company: CompanyInfo, invoice: InvoiceData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text(company.name, 20, 20);
  doc.setFontSize(10);
  if (company.address) doc.text(company.address, 20, 28);
  if (company.phone) doc.text(`Phone: ${company.phone}`, 20, 34);
  if (company.email) doc.text(`Email: ${company.email}`, 20, 40);
  
  // Invoice Title
  doc.setFontSize(18);
  doc.text("INVOICE", 150, 20);
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 150, 28);
  doc.text(`Date: ${invoice.date}`, 150, 34);
  
  // Customer Info
  doc.text("Bill To:", 20, 55);
  doc.text(invoice.customerName, 20, 61);
  if (invoice.customerEmail) doc.text(invoice.customerEmail, 20, 67);
  
  // Items Table
  let yPos = 85;
  doc.setFontSize(10);
  doc.text("Item", 20, yPos);
  doc.text("Qty", 100, yPos);
  doc.text("Price", 130, yPos);
  doc.text("Total", 170, yPos);
  
  doc.line(20, yPos + 2, 190, yPos + 2);
  yPos += 8;
  
  invoice.items.forEach((item) => {
    doc.text(item.name, 20, yPos);
    doc.text(item.quantity.toString(), 100, yPos);
    doc.text(`$${item.price.toFixed(2)}`, 130, yPos);
    doc.text(`$${item.total.toFixed(2)}`, 170, yPos);
    yPos += 6;
  });
  
  // Totals
  yPos += 5;
  doc.line(130, yPos, 190, yPos);
  yPos += 8;
  doc.text("Subtotal:", 130, yPos);
  doc.text(`$${invoice.subtotal.toFixed(2)}`, 170, yPos);
  yPos += 6;
  doc.text("Tax:", 130, yPos);
  doc.text(`$${invoice.tax.toFixed(2)}`, 170, yPos);
  yPos += 6;
  doc.setFontSize(12);
  doc.text("Total:", 130, yPos);
  doc.text(`$${invoice.total.toFixed(2)}`, 170, yPos);
  
  doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
};

export const generateReceiptPDF = (company: CompanyInfo, receipt: ReceiptData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text(company.name, 105, 20, { align: "center" });
  doc.setFontSize(10);
  if (company.address) doc.text(company.address, 105, 28, { align: "center" });
  if (company.phone) doc.text(`Phone: ${company.phone}`, 105, 34, { align: "center" });
  
  // Receipt Title
  doc.setFontSize(16);
  doc.text("RECEIPT", 105, 50, { align: "center" });
  doc.setFontSize(10);
  doc.text(`Receipt #: ${receipt.receiptNumber}`, 105, 58, { align: "center" });
  doc.text(`Date: ${receipt.date}`, 105, 64, { align: "center" });
  
  if (receipt.customerName) {
    doc.text(`Customer: ${receipt.customerName}`, 105, 70, { align: "center" });
  }
  
  // Items
  let yPos = 85;
  doc.line(20, yPos, 190, yPos);
  yPos += 8;
  
  receipt.items.forEach((item) => {
    doc.text(item.name, 20, yPos);
    doc.text(`${item.quantity} x $${item.price.toFixed(2)}`, 170, yPos, { align: "right" });
    yPos += 6;
  });
  
  yPos += 5;
  doc.line(20, yPos, 190, yPos);
  yPos += 8;
  
  doc.setFontSize(12);
  doc.text("Total:", 20, yPos);
  doc.text(`$${receipt.total.toFixed(2)}`, 190, yPos, { align: "right" });
  yPos += 8;
  doc.setFontSize(10);
  doc.text(`Payment Method: ${receipt.paymentMethod}`, 105, yPos, { align: "center" });
  
  doc.save(`receipt-${receipt.receiptNumber}.pdf`);
};

export const generatePayrollSlipPDF = (company: CompanyInfo, payroll: PayrollData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text(company.name, 105, 20, { align: "center" });
  doc.setFontSize(14);
  doc.text("PAYROLL SLIP", 105, 30, { align: "center" });
  
  // Employee Info
  doc.setFontSize(10);
  doc.text(`Employee: ${payroll.employeeName}`, 20, 50);
  doc.text(`Employee #: ${payroll.employeeNumber}`, 20, 56);
  doc.text(`Pay Period: ${payroll.period}`, 20, 62);
  
  // Earnings and Deductions
  let yPos = 80;
  doc.setFontSize(12);
  doc.text("Earnings", 20, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.text("Basic Salary:", 30, yPos);
  doc.text(`$${payroll.basicSalary.toFixed(2)}`, 170, yPos, { align: "right" });
  yPos += 6;
  doc.text("Bonuses:", 30, yPos);
  doc.text(`$${payroll.bonuses.toFixed(2)}`, 170, yPos, { align: "right" });
  
  yPos += 12;
  doc.setFontSize(12);
  doc.text("Deductions", 20, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.text("Total Deductions:", 30, yPos);
  doc.text(`$${payroll.deductions.toFixed(2)}`, 170, yPos, { align: "right" });
  
  yPos += 15;
  doc.line(20, yPos, 190, yPos);
  yPos += 8;
  doc.setFontSize(14);
  doc.text("Net Salary:", 30, yPos);
  doc.text(`$${payroll.netSalary.toFixed(2)}`, 170, yPos, { align: "right" });
  
  doc.save(`payroll-${payroll.employeeNumber}-${payroll.period}.pdf`);
};
