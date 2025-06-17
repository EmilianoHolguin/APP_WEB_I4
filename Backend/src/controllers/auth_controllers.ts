//Backend/src/controllers/auth_controllers.ts
import { Request, Response } from "express";
import { generateToken, verifyAccessToken } from "../utils/token";
import { cache } from "../utils/cache";
import dayjs from "dayjs";
import { User } from "../models/user";
import bcrypt from "bcryptjs";

export const loginMethod = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    if (user.status === false) {
      return res.status(403).json({ message: "El usuario está inactivo" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const accessToken = generateToken(user._id.toString());

    cache.set(
      user._id.toString(),
      {
        token: accessToken,
        name: `${user.firstName} ${user.lastName}`,
        createdAt: Date.now(),
      },
      60 * 15 // TTL 15 minutos
    );

    const { password: _, ...userData } = user.toObject();

    return res.json({ accessToken, user: userData });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ message: "Error del servidor", error });
  }
};

export const getTimeToken = (req: Request, res: Response) => {
  const { userID } = req.params;

  const ttl = cache.getTtl(userID);
  if (!ttl) {
    return res.status(404).json({
      message: "Token no encontrado o no existe",
    });
  }

  const now = Date.now();
  const timeToLife = Math.floor((ttl - now) / 1000);
  const expTime = dayjs(ttl).format("HH:mm:ss");

  return res.json({ timeToLife, expTime });
};

export const getUserIdFromToken = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  return res.json({ userID: payload.userID || payload.userId });
};

export const updateToken = (req: Request, res: Response) => {
  const { userID } = req.params;

  const userData = cache.get(userID) as {
    token: string;
    name: string;
    createdAt: number;
  };
  const ttl = cache.getTtl(userID);

  if (!userData || !ttl) {
    return res.status(404).json({
      message: "Token no encontrado o expirado",
    });
  }

  const newTimeToken: number = 60 * 15;
  cache.ttl(userID, newTimeToken);

  res.json({ message: "Token actualizado" });
};

// getAllUsers
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios", error: err });
  }
};

// getUserByUsername
export const getUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar usuario", error });
  }
};

// saveUser
export const saveUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, email, password, roles } = req.body;

    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !Array.isArray(roles) ||
      roles.length === 0
    ) {
      return res.status(400).json({
        message:
          "Todos los campos son obligatorios, incluyendo al menos un rol",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Correo electrónico no válido" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "Usuario o correo ya existente" });
    }

    const validStatuses = ["Admin", "Employee"];
    for (const role of roles) {
      if (!role.name || !role.type || !role.Status) {
        return res
          .status(400)
          .json({ message: "Cada rol debe tener name, type y Status" });
      }
      if (!validStatuses.includes(role.Status)) {
        return res
          .status(400)
          .json({ message: `Status de rol inválido: ${role.Status}` });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Asignar role desde el primer rol del arreglo
    const mainRole = roles[0].Status;

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      roles,
      role: mainRole,
    });

    const user = await newUser.save();

    const { password: _, ...userData } = user.toObject();
    return res.status(201).json({ user: userData });
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    return res.status(500).json({ message: "Error al guardar usuario", error });
  }
};

// updateUser
export const updateUser = async (req: Request, res: Response) => {
  const { userID } = req.params;
  const {
    email,
    password,
    firstName,
    lastName,
    username,
    roles,
  } = req.body;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "Usuario no existe" });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Correo electrónico no válido" });
      }

      const userEmail = await User.findOne({ email });
      if (userEmail && userEmail._id.toString() !== userID) {
        return res.status(426).json({ message: "El correo ya existe" });
      }

      user.email = email;
    }

    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (roles) {
      if (!Array.isArray(roles) || roles.length === 0) {
        return res.status(400).json({ message: "Debes enviar al menos un rol válido" });
      }

      const validStatuses = ["Admin", "Employee"];
      for (const role of roles) {
        if (!role.name || !role.type || !role.Status) {
          return res.status(400).json({ message: "Cada rol debe tener name, type y Status" });
        }
        if (!validStatuses.includes(role.Status)) {
          return res.status(400).json({ message: `Status de rol inválido: ${role.Status}` });
        }
      }

      user.roles = roles;
      user.role = roles[0].Status; // sincronizar role
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (username) user.username = username;

    const updatedUser = await user.save();
    const { password: _, ...userData } = updatedUser.toObject();

    return res.json({ user: userData });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({ message: "Error del servidor", error });
  }
};

// deleteUser
export const deleteUser = async (req: Request, res: Response) => {
  const { userID } = req.params;

  const user = await User.findById(userID);
  if (!user) {
    return res.status(404).json({ message: "Usuario no existe" });
  }

  user.status = false;
  user.deleteDate = new Date();

  const deletedUser = await user.save();
  return res.json({ deletedUser });
};
