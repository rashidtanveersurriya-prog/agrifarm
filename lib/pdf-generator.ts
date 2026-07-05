import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Sale, Purchase, Expense } from '@/types';

interface ReportConfig {
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  shopEmail: string;
  reportDate: string;
  customHeader?: string;
  customFooter?: string;
}

export class PDFGenerator {
  private doc: jsPDF;
  private config: ReportConfig;
  private pageHeight: number;
  private pageWidth: number;
  private currentY: number;

  constructor(config: ReportConfig) {
    this.doc = new jsPDF();
    this.config = config;
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.currentY = 20;
  }

  private addHeader() {
    const margin = 10;
    const lineHeight = 7;

    // Shop name
    this.doc.setFontSize(16);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(this.config.shopName, margin, this.currentY);

    this.currentY += lineHeight;

    // Shop details
    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(`Address: ${this.config.shopAddress}`, margin, this.currentY);
    this.currentY += lineHeight;

    this.doc.text(`Phone: ${this.config.shopPhone}`, margin, this.currentY);
    this.currentY += lineHeight;

    this.doc.text(`Email: ${this.config.shopEmail}`, margin, this.currentY);
    this.currentY += lineHeight;

    // Horizontal line
    this.doc.setDrawColor(0);
    this.doc.line(margin, this.currentY, this.pageWidth - margin, this.currentY);
    this.currentY += lineHeight;

    // Custom header if provided
    if (this.config.customHeader) {
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'bold');
      this.doc.text(this.config.customHeader, margin, this.currentY);
      this.currentY += lineHeight;
    }

    this.doc.setFontSize(10);
    this.doc.text(`Report Date: ${this.config.reportDate}`, margin, this.currentY);
    this.currentY += lineHeight + 2;
  }

  private addFooter() {
    this.doc.setFontSize(8);
    this.doc.setFont(undefined, 'normal');

    const pageCount = this.doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      const pageHeight = this.doc.internal.pageSize.getHeight();
      const pageWidth = this.doc.internal.pageSize.getWidth();

      // Page number
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      // Custom footer
      if (this.config.customFooter) {
        this.doc.text(this.config.customFooter, 10, pageHeight - 5);
      }
    }
  }

  private checkPageBreak(requiredSpace: number = 20) {
    if (this.currentY + requiredSpace > this.pageHeight - 20) {
      this.doc.addPage();
      this.currentY = 20;
      return true;
    }
    return false;
  }

  generateSalesReport(sales: Sale[]) {
    this.addHeader();

    this.doc.setFontSize(11);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('SALES REPORT', 10, this.currentY);
    this.currentY += 10;

    const tableData = sales.map((sale) => [
      sale.invoice_number,
      sale.customer?.name || 'N/A',
      new Date(sale.sale_date).toLocaleDateString(),
      `${parseFloat(sale.net_amount.toString()).toFixed(2)}`,
      sale.payment_status,
    ]);

    autoTable(this.doc, {
      head: [['Invoice #', 'Customer', 'Date', 'Amount', 'Status']],
      body: tableData,
      startY: this.currentY,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;

    // Total
    const totalAmount = sales.reduce((sum, s) => sum + parseFloat(s.net_amount.toString()), 0);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(`Total Sales: ${totalAmount.toFixed(2)}`, 10, this.currentY);

    this.addFooter();
    return this.doc;
  }

  generatePurchaseReport(purchases: Purchase[]) {
    this.addHeader();

    this.doc.setFontSize(11);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('PURCHASE REPORT', 10, this.currentY);
    this.currentY += 10;

    const tableData = purchases.map((purchase) => [
      purchase.bill_number,
      purchase.trader?.name || 'N/A',
      new Date(purchase.purchase_date).toLocaleDateString(),
      `${parseFloat(purchase.net_amount.toString()).toFixed(2)}`,
      purchase.payment_status,
    ]);

    autoTable(this.doc, {
      head: [['Bill #', 'Trader', 'Date', 'Amount', 'Status']],
      body: tableData,
      startY: this.currentY,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;

    const totalAmount = purchases.reduce((sum, p) => sum + parseFloat(p.net_amount.toString()), 0);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(`Total Purchases: ${totalAmount.toFixed(2)}`, 10, this.currentY);

    this.addFooter();
    return this.doc;
  }

  generateExpenseReport(expenses: Expense[]) {
    this.addHeader();

    this.doc.setFontSize(11);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('EXPENSE REPORT', 10, this.currentY);
    this.currentY += 10;

    // Group by category
    const byCategory: Record<string, Expense[]> = {};
    expenses.forEach((exp) => {
      if (!byCategory[exp.category]) {
        byCategory[exp.category] = [];
      }
      byCategory[exp.category].push(exp);
    });

    const tableData: any[] = [];
    let grandTotal = 0;

    Object.entries(byCategory).forEach(([category, items]) => {
      const categoryTotal = items.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
      grandTotal += categoryTotal;

      tableData.push([category, items.length.toString(), categoryTotal.toFixed(2)]);
    });

    autoTable(this.doc, {
      head: [['Category', 'Count', 'Total']],
      body: tableData,
      startY: this.currentY,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
      },
      headStyles: {
        fillColor: [230, 126, 34],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;

    this.doc.setFont(undefined, 'bold');
    this.doc.text(`Total Expenses: ${grandTotal.toFixed(2)}`, 10, this.currentY);

    this.addFooter();
    return this.doc;
  }

  generateInvoicePDF(sale: Sale) {
    this.doc.setFontSize(16);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(`INVOICE`, 10, 20);

    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(`Invoice #: ${sale.invoice_number}`, 10, 30);
    this.doc.text(`Date: ${new Date(sale.sale_date).toLocaleDateString()}`, 10, 37);

    // Customer details
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Bill To:', 10, 50);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(sale.customer?.name || 'N/A', 10, 57);
    this.doc.text(sale.customer?.address || '', 10, 64);

    // Items table
    const tableData = (sale.sales_items || []).map((item) => [
      item.product?.name || 'N/A',
      item.quantity.toString(),
      item.unit_price.toFixed(2),
      item.line_total.toFixed(2),
    ]);

    autoTable(this.doc, {
      head: [['Item', 'Qty', 'Unit Price', 'Total']],
      body: tableData,
      startY: 75,
      theme: 'grid',
    });

    const finalY = (this.doc as any).lastAutoTable.finalY + 10;

    // Totals
    this.doc.text(`Subtotal: ${sale.total_amount.toFixed(2)}`, 150, finalY);
    this.doc.text(`Tax: ${sale.tax_amount.toFixed(2)}`, 150, finalY + 7);
    this.doc.text(`Discount: ${sale.discount.toFixed(2)}`, 150, finalY + 14);

    this.doc.setFont(undefined, 'bold');
    this.doc.text(`Total: ${sale.net_amount.toFixed(2)}`, 150, finalY + 21);

    this.addFooter();
    return this.doc;
  }

  save(filename: string) {
    this.doc.save(filename);
  }

  download(filename: string) {
    return this.doc.output('blob');
  }
}
