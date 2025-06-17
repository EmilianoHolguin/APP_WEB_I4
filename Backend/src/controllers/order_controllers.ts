// controllers/order.controller.ts
import { Request, Response } from "express";
import { Order } from "../models/order";
import { Product } from "../models/product";

// Crear una orden
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { IDUser, Status, Products } = req.body;

    if (!IDUser || !Array.isArray(Products) || Products.length === 0) {
      return res
        .status(400)
        .json({ message: "Faltan datos obligatorios o Products está vacío" });
    }

    const enrichedProducts = [];
    let subtotal = 0;

    for (const item of Products) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({
          message:
            "Cada producto debe tener productId válido y quantity mayor a 0",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Producto no encontrado con ID: ${productId}` });
      }

      const itemPrice = Number(product.price);
      const itemQuantity = Number(quantity);

      const itemTotal = itemPrice * itemQuantity;
      subtotal += itemTotal;

      enrichedProducts.push({
        productId,
        name: product.name,
        quantity: itemQuantity,
        price: itemPrice,
      });
    }

    const ivaRate = 0.16;
    const total = +(subtotal * (1 + ivaRate)).toFixed(2);

    const newOrder = new Order({
      IDUser,
      Status,
      Subtotal: subtotal,
      Total: total,
      Products: enrichedProducts,
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({ order: savedOrder });
  } catch (error) {
    console.error("Error al crear orden:", error);
    return res.status(500).json({ message: "Error al crear orden", error });
  }
};

// Cancelar una orden (soft delete)
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
      id,
      { Status: "Canceled" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    return res.status(200).json({ message: "Orden cancelada", order });
  } catch (error) {
    console.error("Error al cancelar orden:", error);
    return res.status(500).json({ message: "Error al cancelar orden", error });
  }
};

// Actualizar una orden
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    return res
      .status(200)
      .json({ message: "Orden actualizada", order: updatedOrder });
  } catch (error) {
    console.error("Error al actualizar orden:", error);
    return res.status(500).json({ message: "Error al actualizar orden", error });
  }
};
