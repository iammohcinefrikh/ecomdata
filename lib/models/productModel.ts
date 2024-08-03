import mongoose, { Document } from "mongoose";

interface IProduct extends Document {
  productName: string;
  productPrice: number;
  productUrl: string;
  productWebsite: string;
  productPriceHistory: Array<{ productPrice: number; priceLogDate: Date }>;
  productUsers: Array<{ userEmail: string; userImportDate: Date }>;
}

const productSchema = new mongoose.Schema<IProduct>({
  productName: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  productUrl: {
    type: String,
    required: true
  },
  productWebsite: {
    type: String,
    required: true
  },
  productPriceHistory: [
    {
      productPrice: {
        type: Number,
        required: true
      },
      priceLogDate: {
        type: Date,
        required: true,
        default: Date.now
      }
    }
  ],
  productUsers: [
    {
      userEmail: {
        type: String,
        required: true
      },
      userImportDate: {
        type: Date,
        required: true,
        default: Date.now
      }
    }
  ]
}, { collection: "product" });

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;