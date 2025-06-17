//Backend/src/models/product.ts
import { Document, Types, Schema, model } from "mongoose";

export interface IOrderProduct extends Document {
  productId: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  IDUser: string;
  createDate: Date;
  updateDate: Date;
  Status: "Pending" | "Payed" | "Canceled";
  Total: number;
  Subtotal: number;
  Products: IOrderProduct[];
}

const orderProductSchema = new Schema<IOrderProduct>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    IDUser: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      enum: ["Pending", "Payed", "Canceled"],
      default: "Pending",
    },
    Total: {
      type: Number,
      required: true,
    },
    Subtotal: {
      type: Number,
      required: true,
    },
    Products: {
      type: [orderProductSchema],
      required: true,
      validate: [
        (array: any[]) => array.length > 0,
        "Debe contener al menos un producto",
      ],
    },
  },
  {
    timestamps: { createdAt: "createDate", updatedAt: "updateDate" },
  }
);

export const Order = model<IOrder>("Order", orderSchema, "orders");
