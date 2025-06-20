// Backend/src/models/menu.ts
import { Document, Schema, Types, model } from "mongoose";

export interface IMenu extends Document {
  _id: Types.ObjectId;
  label: string;
  path: string;
  icon: string;
  roles: Array<{
    type: "Administrador" | "Cliente" | "Empleado";
  }>;
}

const menuSchema = new Schema<IMenu>({
  label: { type: String, required: true },
  path: { type: String, required: true },
  icon: { type: String, required: true },
  roles: [
    {
      type: {
        type: String,
        enum: ["Administrador", "Cliente", "Empleado"],
        required: true,
      },
    },
  ],
}, {
  versionKey: false,
  collection: "menu",
});

export const Menu = model<IMenu>("Menu", menuSchema);
