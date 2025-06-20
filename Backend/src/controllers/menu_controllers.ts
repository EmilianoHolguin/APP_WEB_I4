// Backend/src/controllers/menu_controllers.ts
import { Request, Response } from "express";
import { Menu } from "../models/menu";

// Crear un nuevo menú
export const createMenu = async (req: Request, res: Response) => {
  try {
    const { label, path, icon, roles } = req.body;

    if (!label || !path || !icon || !roles || !roles.length) {
      return res.status(400).json({ message: "Faltan campos obligatorios o roles vacíos" });
    }

    const newMenu = new Menu({ label, path, icon, roles });
    const menu = await newMenu.save();

    return res.status(201).json({ message: "Menú creado exitosamente", menu });
  } catch (error: any) {
    console.error("Error al crear menú:", error);
    return res.status(400).json({ message: "Error al crear menú", error: error.message });
  }
};

// Obtener menús por rol
export const getMenuByRole = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;

    const menus = await Menu.find({ "roles.type": type });
    return res.status(200).json({ message: "Menús encontrados", menus });
  } catch (error) {
    console.error("Error al obtener menús:", error);
    return res.status(500).json({ message: "Error al obtener menús", error });
  }
};
