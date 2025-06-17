//Backend/src/controllers/product_controllers.ts
import { Request, Response } from "express";
import { Product } from "../models/product";

// Crear producto
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, qty, description } = req.body;

    if (!name || !price || !qty || !description) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const newProduct = new Product({ name, price, qty, description });

    const savedProduct = await newProduct.save();
    return res.status(201).json({ product: savedProduct });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "El producto ya existe" });
    }

    console.error("Error al crear producto:", error);
    return res.status(500).json({ message: "Error del servidor", error });
  }
};

// Obtener todos los productos activos
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ status: true });
    return res.json({ products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar producto
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, qty, description } = req.body;

    const updated = await Product.findByIdAndUpdate(
      id,
      { name, price, qty, description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json({ product: updated });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

// Baja lógica del producto
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndUpdate(
      id,
      { status: false, deleteDate: new Date() },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json({ message: "Producto dado de baja correctamente", product: deleted });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};
