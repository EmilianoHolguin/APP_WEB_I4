//Backend/src/controllers/role_controllers.ts
import { Request, Response } from "express";
import { Role } from "../models/role"; // Ajusta el path si es necesario

// Crear un nuevo rol
export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, type, Status } = req.body;

    if (!name || !type || Status == null) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios: name, type, Status",
      });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(409).json({ message: "El rol ya existe" });
    }

    const newRole = new Role({ name, type, Status });
    const savedRole = await newRole.save();

    return res.status(201).json({ role: savedRole });
  } catch (error) {
    console.error("Error al crear rol:", error);
    return res.status(500).json({ message: "Error al crear rol", error });
  }
};

// Obtener todos los roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find();
    return res.status(200).json(roles);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return res.status(500).json({ message: "Error al obtener roles", error });
  }
};

// Obtener un rol por ID
export const getRoleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    return res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({ message: "Error al buscar rol", error });
  }
};

// Actualizar rol
export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, Status } = req.body;

  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    role.name = name ?? role.name;
    role.type = type ?? role.type;
    role.Status = Status ?? role.Status;

    const updated = await role.save();
    return res.status(200).json({ message: "Rol actualizado", role: updated });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar rol", error });
  }
};

// Eliminar (desactivar) rol
export const deleteRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    role.Status = false;
    role.deleteDate = new Date();

    const deleted = await role.save();
    return res.status(200).json({ message: "Rol desactivado", role: deleted });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar rol", error });
  }
};
