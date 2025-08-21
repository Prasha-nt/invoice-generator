import mongoose from 'mongoose';

export interface IProduct {
  name: string;
  quantity: number;
  rate: number;
  total: number;
  gst: number;
}

export interface IInvoice extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  products: IProduct[];
  subTotal: number;
  gstAmount: number;
  totalAmount: number;
  date: Date;
  invoiceNumber: string;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  gst: {
    type: Number,
    required: true,
  },
});

const invoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [productSchema],
  subTotal: {
    type: Number,
    required: true,
  },
  gstAmount: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

// Generate invoice number before saving
invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `INV-${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);
