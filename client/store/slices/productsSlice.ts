import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  total: number;
  gst: number;
}

interface ProductsState {
  products: Product[];
  subTotal: number;
  gstAmount: number;
  totalAmount: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  subTotal: 0,
  gstAmount: 0,
  totalAmount: 0,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Omit<Product, 'id' | 'total' | 'gst'>>) => {
      const { name, quantity, rate } = action.payload;
      const total = quantity * rate;
      const gst = total * 0.18; // 18% GST
      
      const newProduct: Product = {
        id: Date.now().toString(),
        name,
        quantity,
        rate,
        total,
        gst,
      };
      
      state.products.push(newProduct);
      productsSlice.caseReducers.calculateTotals(state);
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(product => product.id !== action.payload);
      productsSlice.caseReducers.calculateTotals(state);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        const { quantity, rate } = action.payload;
        const total = quantity * rate;
        const gst = total * 0.18;
        
        state.products[index] = {
          ...action.payload,
          total,
          gst,
        };
        productsSlice.caseReducers.calculateTotals(state);
      }
    },
    clearProducts: (state) => {
      state.products = [];
      state.subTotal = 0;
      state.gstAmount = 0;
      state.totalAmount = 0;
    },
    calculateTotals: (state) => {
      state.subTotal = state.products.reduce((sum, product) => sum + product.total, 0);
      state.gstAmount = state.products.reduce((sum, product) => sum + product.gst, 0);
      state.totalAmount = state.subTotal + state.gstAmount;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addProduct,
  removeProduct,
  updateProduct,
  clearProducts,
  calculateTotals,
  setLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;
