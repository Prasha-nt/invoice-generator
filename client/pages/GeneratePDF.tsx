import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { clearProducts } from '../store/slices/productsSlice';
import html2pdf from "html2pdf.js";
import LevitationLogo from '../components/LevitationLogo';

export default function GeneratePDF() {
  const [generating, setGenerating] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { products, subTotal, gstAmount, totalAmount } = useAppSelector((state) => state.products);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const generatePDFContent = () => {
    const invoiceHtml = `
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
                padding: 0;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                padding-bottom: 5rem;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 30px;
            }
            .logo {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .logo-icon {
        width: 37px;
        height: 36px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: transparent;
      }
      .logo-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
            /* text + description stacked vertically */
            .logo-text-container {
                display: flex;
                flex-direction: column;
                line-height: 1.2;
            }
            .logo-text {
                font-weight: bold;
                font-size: 16px;
            }
            .logo-des {
                font-size: 14px;
                color: #555;
                margin-top: 2px;
            }
            .invoice-title {
                text-align: right;
            }
            .invoice-title h1 {
                margin: 0;
                font-size: 24px;
                font-weight: bold;
                color: #333;
            }
            .invoice-title p {
                margin: 5px 0 0 0;
    color: #6b7280;
    font-size: 12px;
    text-align: left;
            }
            .customer-info {
                background-color: #141414;
                background-image: radial-gradient(ellipse 50% 100% at 50% 0%, #141414 0%, #1E1E2A 100%);
                color: white;
                margin-left: 2.25rem;
                margin-right: 2.25rem;
                margin-bottom: 2rem;
                padding: 1.5rem;
                border-radius: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .customer-details h3 {
                margin: 0;
                font-size: small;
                color: white;
                font-weight: lighter;
                margin-bottom: 5px;
            }
            .customer-name {
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 300;
                color: #CCF575;
                margin: 0;
            }
            .customer-date {
                margin-bottom: 1rem;
            }
            .customer-email {
                background-color: rgb(255, 255, 255);
                font-size: 1.1rem;
                line-height: 1.75rem;
                margin-bottom: 0.75rem;
                padding: 0.25rem 1rem;
                border-radius: 1rem;
                color: #141414;
                
                margin: 5px 0 0 0;
            }
            .invoice-meta {
                text-align: right;
                font-size: 14px;
            }
            .products-table {
    width: calc(100% - 4.5rem);
    margin: 2.25rem;
    border-collapse: collapse;
    overflow: hidden;
    border-radius: 12px;
    table-layout: fixed; /* ensures equal column width */
}
            .products-table thead {
                background: linear-gradient(to right, #303661, #263406);
                color: white;
            }
            .products-table thead th:first-child {
                border-top-left-radius: 9999px;
                border-bottom-left-radius: 9999px;
            }
            .products-table thead th:last-child {
                border-top-right-radius: 9999px;
                border-bottom-right-radius: 9999px;
            }
            .products-table th,
.products-table td {
    padding: 1rem;
    text-align: left;
    width: 25%; /* 4 equal columns */
    word-wrap: break-word; /* ensures long text wraps */
}
            .products-table th:last-child,
            .products-table td:last-child {
                text-align: left;
            }
            .products-table th {
                font-weight: 600;
                font-size: 14px;
            }
            .products-table tbody tr:nth-child(even) {
                background-color: #f8f9fa;
            }
            .totals {
                padding: 20px 30px;
                margin-right: 2.25rem;
                margin-left:45% ;
                background: #f8f9fa;
                border:1px solid #303030;
                border-radius: 0.75rem;
                margin-bottom: 5.5rem;
            }
            .totals-grid {
                display: flex;
                justify-content: flex-end;
            }
            .totals-table {
                min-width: 300px;
            }
            .totals-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                
            }
            .alltotal{
                color: #141414;
            }
            .total-final {
                font-weight: bold;
                font-size: 20px;
                color: #2563eb;
                
                padding-top: 12px;
                margin-top: 8px;
               
            }
            .invoice-number{
                margin-left: 1.5rem;
                margin-bottom: 3.5rem;
                font-size: 0.875rem /* 14px */;
    line-height: 1.25rem /* 20px */;
                color: #6b7280;
            }
            .invoice-des {
                text-align: center;
                padding: 8px 12px;
                color: #666;
                font-size: 12px;
                margin-top: 3.5rem;
                margin-bottom: 10rem;
                background-color: #272833;
                margin:0 7rem  ;
                color: white;
                border-radius: 9999px;
               
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="header">
                <div class="logo">
                    <div class="logo-icon">
                        <img src="/logo1.png" alt="Logo" class="logo-img">
          </div>
                    <div class="logo-text-container">
                        <span class="logo-text">Levitation</span>
                        <span class="logo-des">infotech</span>
                    </div>
                </div>
                <div class="invoice-title">
                    <h1>INVOICE GENERATOR</h1>
                    <p>Sample output should be this.</p>
                </div>
            </div>

            <div class="customer-info">
                <div class="customer-details">
                    <h3>Name:</h3>
                    <p class="customer-name">${user?.name || 'Person_name'}</p>
                </div>
                <div class="invoice-meta">
                    <div class="customer-date">Date: ${new Date().toLocaleDateString('en-GB')}</div>
                    <p class="customer-email">${user?.email || 'example@gmail.com'}</p>
                </div>
            </div>

            <table class="products-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map((product, index) => `
                        <tr>
                            <td>Product ${index + 1}</td>
                            <td>${product.quantity}</td>
                            <td>${product.rate}</td>
                            <td>USD ${product.total.toFixed(0)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="totals">
                <div class="totals-grid">
                    <div class="totals-table">
                        <div class="totals-row">
                            <span>Total Charges:</span>
                            <span>₹${subTotal.toFixed(0)}</span>
                        </div>
                        <div class="totals-row">
                            <span>GST (18%):</span>
                            <span>18%</span>
                        </div>
                        <div class="totals-row total-final">
                            <span class="alltotal">Total Amount:</span>
                            <span>₹ ${totalAmount.toFixed(0)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="invoice-number">
                <p>Date:${new Date().toLocaleDateString('en-GB')}</p>
            </div>

            <div class="invoice-des">
                <p>We are pleased to provide any further information you may require and look forward to assisting with your next order. Rest assured, it will receive our prompt and dedicated attention.</p>
            </div>
        </div>
    </body>
</html>

    `;
    return invoiceHtml;
  };

  const handleGeneratePDF = async () => {
    if (products.length === 0) {
      alert("No products to generate invoice for");
      return;
    }
  
    setGenerating(true);
  
    try {
      const htmlContent = generatePDFContent();
  
      // Create a temporary container
      const element = document.createElement("div");
      element.innerHTML = htmlContent;
  
      // Options for PDF
      const opt = {
        margin: 0.5,
        filename: `invoice-${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
  
      await html2pdf().set(opt).from(element).save();
  
      setPdfGenerated(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF");
    } finally {
      setGenerating(false);
    }
  };
  
  const handleBackToProducts = () => {
    navigate('/products');
  };

  const handleNewInvoice = () => {
    dispatch(clearProducts());
    navigate('/products');
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">No Products Added</h1>
          <p className="text-gray-400 mb-6">Please add products first to generate an invoice.</p>
          <button
            onClick={handleBackToProducts}
            className="bg-[#CCF575] text-black font-medium px-6 py-3 rounded-lg hover:bg-lime-300 transition-colors"
          >
            Go to Add Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#202020]">
       <header className="bg-[#1F1F1F] shadow-md shadow-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Using a placeholder image for the logo */}
              <img
                src="/logo.png"
                alt="Company Logo"
                className="h-10 w-10"
              />
              <div className="flex flex-col">
                <span className="text-white font-medium text-lg">levitation</span>
                <span className="text-gray-400 text-sm">Infotech</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-[#CCF575] text-black text-sm font-medium px-4 py-2 rounded hover:bg-lime-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">Generate PDF Invoice</h1>
          <p className="text-gray-400">
            Review your invoice details and generate PDF
          </p>
        </div>

        {/* Invoice Preview - Matching Sample Format */}
        <div className="bg-white rounded-lg overflow-hidden mb-8 shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center space-x-3 ml-3">
            <img
                src="/logo1.png"
                alt="Company Logo"
                className="h-14 w-14"
              />
              <div className="flex flex-col">
              <span className="text-black font-normal text-3xl">Levitation</span>
              <span className="text-black text-sm">infotech</span>
              </div>
            </div>
            <div className="text-right mr-5">
              <h2 className="text-2xl font-bold text-black">INVOICE GENERATOR</h2>
              <p className="text-gray-600 text-sm">Sample output should be this.</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className=" bg-[#141414] bg-custom-gradient text-white  p-6 mx-9 rounded-xl mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-grey-400 font-light text-sm mb-2">Name:</p>
                <p className="text-xl text-[#CCF575] font-medium text-4xl">{user?.name || 'Person_name'}</p>
               
              </div>
              <div className="text-right">
                <p className="text-gray-300 mb-3">Date: {new Date().toLocaleDateString('en-GB')}</p>
              <p className="text-black text-xl mb-2 bg-white rounded-2xl px-4 py-1">{user?.email || 'example@gmail.com'}</p>
              </div>
            </div>
          </div>

          {/* Products Table */}
<div className="mx-6 lg:mx-9">
  <table className="w-full">
    <thead>
    <tr className="bg-gradient-to-r from-[#303661] to-[#263406] text-white rounded-full">
      <th className="w-1/4 p-4 px-8 text-left rounded-tl-full rounded-bl-full ">Product Name</th>
      <th className="w-1/4 p-4 text-left">Qty</th>
      <th className="w-1/4 p-4 text-left">Rate</th>
      <th className="w-1/4 p-4 text-left rounded-tr-full rounded-br-full">Total</th>
    </tr>
    </thead>
    <tbody>
      {products.map((product, index) => (
        <tr key={product.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
          <td className="p-4 px-8">Product {index + 1}</td>
          <td className="p-4">{product.rate}</td>
          <td className="p-4">{product.quantity}</td>
          <td className=" p-4">USD {product.total.toFixed(0)}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


          {/* Totals */}
          <div className="bg-gray-50 p-6 mt-11 mr-9 justify-end ml-[65%] border border-[#303030] rounded-xl">
            <div className="flex justify-end">
              <div className="w-80 space-y-3">
                <div className="flex justify-between pb-2 font-light">
                  <span>Total Charges:</span>
                  <span>${subTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between pb-2 font-light">
                  <span>GST (18%):</span>
                  <span>18%</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-blue-600  pt-3">
                  <span className=" text-black">Total Amount:</span>
                  <span>₹ {totalAmount.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Number */}
          <div className="text- left ml-7 my-14 p-4">
          
            {/* <p className="text-gray-500 text-sm">GST: {Date.now().toString().slice(-6)}</p> */}
            <p className="text-gray-500 text-sm">Date: {new Date().toLocaleDateString('en-GB')}</p>
          </div>
          <div className="text-center  mx-28 mt-14 mb-20 p-4 px-5 bg-[#272833] rounded-full ">
          
            {/* <p className="text-gray-500 text-sm">GST: {Date.now().toString().slice(-6)}</p> */}
            <p className="text-white text-sm">We are pleased to provide any further information you may require and look forward to assisting with your next order. Rest assured, it will receive our prompt and dedicated attention.</p>
          </div>
        </div>
        

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleBackToProducts}
            className="bg-slate-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors"
          >
            ← Back to Products
          </button>
          
          <button
            onClick={handleGeneratePDF}
            disabled={generating}
            className="bg-[#CCF575] text-black font-semibold px-8 py-4 rounded-lg hover:bg-lime-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? 'Generating PDF...' : 'Download PDF Invoice'}
          </button>

          <button
            onClick={handleNewInvoice}
            className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors"
          >
            Create New Invoice
          </button>
        </div>

        {/* {pdfGenerated && (
          <div className="mt-6 text-center">
            <div className="bg-green-600 bg-opacity-20 border border-green-500 rounded-lg p-4">
              <p className="text-green-400 font-medium mb-2">✅ PDF Generated Successfully!</p>
              <p className="text-gray-300 text-sm">Your invoice has been downloaded to your device.</p>
            </div>
          </div>
        )} */}
      </div>

    
    </div>
  );
}
