//Backend/src/models/role.ts
import { Document, Types, Schema, model } from "mongoose";

export interface IRole extends Document{
    name: String,
    type: String,
    Status: String
}

const roleSchema = new Schema<IRole>({
    name:{
        type: String,
    },

    type: {
        type: String
    },

    Status:{
        type: String,
        enum: ['Admin', 'Employee', 'Client']
    }
})

export const Role = model<IRole>('Role', roleSchema, 'roles')