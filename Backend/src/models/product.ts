//Backend/src/models/product.ts
import { Document, Types, Schema, model, Double, Int32 } from "mongoose";

export interface IProduct extends Document{
    _id:Types.ObjectId,
    name: string,
    price: Number,
    qty:Number,
    status: Boolean,
    description: String,
    createDate: Date,
    deleteDate: Date
}


const productSchema = new Schema<IProduct>({
    name:{
        type:String,
        required:true,
        unique: true
    },

    price:{
        type:Number,
        required: true
    },

    qty:{
        type: Number,
        required: true,
        min: 1
    },

    status:{
        type: Boolean,
        default: true
    },

    description:{
        type: String,
        required: true
    },

    createDate:{
        type: Date,
        default: Date.now
    },

    deleteDate:{
        type: Date,
    }

});
        
export const Product = model<IProduct>('Product', productSchema, 'products')