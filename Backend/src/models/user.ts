import { Document, Types, Schema, model } from "mongoose";

// Subdocumento embebido para roles
export interface IUserRole {
  name: string;
  type: string;
  Status: "Admin" | "Employee";
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  status: boolean;
  createDate: Date;
  deleteDate: Date;
  roles: IUserRole[]; // Subdocumento embebido
  firstName: string;
  lastName: string;
}

// Schema del rol embebido (sin _id individual)
const userRoleSchema = new Schema<IUserRole>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      enum: ["Admin", "Employee"],
      required: true,
    },
  },
  { _id: false }
);

// Schema del usuario
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

    createDate: {
      type: Date,
      default: Date.now,
    },

    deleteDate: {
      type: Date,
    },

    roles: {
      type: [userRoleSchema],
      required: true,
      validate: [
        (roles: IUserRole[]) => roles.length > 0,
        "Debe contener al menos un rol",
      ],
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

export const User = model<IUser>("User", userSchema, "users");