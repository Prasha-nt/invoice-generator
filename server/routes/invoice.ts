import { RequestHandler } from 'express';
import puppeteer from 'puppeteer';
import Invoice from '../models/Invoice';
import User from '../models/User';

export const generatePDF: RequestHandler = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const userId = (req as any).user.userId;

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate totals
    const subTotal = products.reduce((sum: number, product: any) => sum + product.total, 0);
    const gstAmount = products.reduce((sum: number, product: any) => sum + product.gst, 0);

    // Save invoice to database
    const invoice = new Invoice({
      user: userId,
      products,
      subTotal,
      gstAmount,
      totalAmount,
    });
    await invoice.save();

    // Generate HTML for PDF
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          border-bottom: 2px solid #e5e5e5;
          padding-bottom: 20px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: #333;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-text {
          font-weight: bold;
          font-size: 18px;
        }
        .invoice-title {
          text-align: right;
        }
        .invoice-title h1 {
          margin: 0;
          font-size: 32px;
          font-weight: bold;
          color: #333;
        }
        .invoice-title p {
          margin: 5px 0 0 0;
          color: #666;
          font-size: 14px;
        }
        .customer-info {
          background: #334155;
          color: white;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
        }
        .customer-name {
          color: #84cc16;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .customer-details h3 {
          margin: 0;
          font-size: 20px;
        }
        .invoice-meta {
          text-align: right;
          color: #cbd5e1;
          font-size: 14px;
        }
        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .products-table thead {
          background: #334155;
          color: white;
        }
        .products-table th,
        .products-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e5e5;
        }
        .products-table th:last-child,
        .products-table td:last-child {
          text-align: right;
        }
        .products-table tbody tr:hover {
          background-color: #f8f9fa;
        }
        .totals {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        }
        .totals-table {
          min-width: 300px;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e5e5;
        }
        .total-final {
          font-weight: bold;
          font-size: 18px;
          color: #84cc16;
          border-top: 2px solid #334155;
          padding-top: 12px;
          margin-top: 8px;
        }
        .note {
          font-size: 12px;
          color: #666;
          margin-bottom: 20px;
        }
        .footer {
          background: #334155;
          color: white;
          padding: 20px;
          border-radius: 6px;
          text-align: center;
          font-size: 12px;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="logo">
            <div class="logo-icon">
              <div style="width: 20px; height: 20px; background: white; border-radius: 2px;"></div>
            </div>
            <span class="logo-text">Levitation</span>
          </div>
          <div class="invoice-title">
            <h1>INVOICE GENERATOR</h1>
            <p>Sample for project purpose</p>
          </div>
        </div>

        <div class="customer-info">
          <div class="customer-details">
            <div class="customer-name">Name</div>
            <h3>${user.name}</h3>
          </div>
          <div class="invoice-meta">
            <div>Date: ${new Date().toLocaleDateString()}</div>
            <div>${user.email}</div>
          </div>
        </div>

        <table class="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${products.map((product: any, index: number) => `
              <tr>
                <td>Product ${index + 1}</td>
                <td>${product.quantity}</td>
                <td>${product.rate}</td>
                <td>USD ${product.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-table">
            <div class="totals-row">
              <span>Total Charges:</span>
              <span>₹${subTotal.toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span>GST (18%):</span>
              <span>18%</span>
            </div>
            <div class="totals-row total-final">
              <span>Total Amount:</span>
              <span>₹ ${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <p class="note">Note: US$${totalAmount.toFixed(2)}</p>

        <div class="footer">
          We are pleased to provide up to thirty information on our product website because it is unlikely with your help.
          Please call 1-855-777-7777 for any questions concerning this product or account at any time.
          <br><br>
          Note: Data collected in this document are always used to produce database.
        </div>
      </div>
    </body>
    </html>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF invoice' });
  }
};

export const getInvoices: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const invoices = await Invoice.find({ user: userId }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
};
