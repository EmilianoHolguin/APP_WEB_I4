// Backend/src/controllers/auth_controllers.ts
import { Request, Response } from 'express';
import { cache } from '../utils/cache';
import { generateToken, verifyAccessToken } from '../utils/token';
import dayjs from 'dayjs';
import { User } from '../models/user';
import bcrypt from 'bcrypt';

// Iniciar sesión
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
      60 * 15
    );

    const { password: _, ...userData } = user.toObject();

    return res.json({ accessToken, user: userData });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ message: "Error del servidor", error });
  }
};

// Obtener tiempo restante del token
export const getTimeToken = (req: Request, res: Response) => {
  const { userID } = req.params;
  const ttl = cache.getTtl(userID);
  if (!ttl) {
    return res.status(404).json({ message: "Token no encontrado" });
  }

  const now = Date.now();
  const timeToLife = Math.floor((ttl - now) / 1000);
  const expTime = dayjs(ttl).format('HH:mm:ss');

  return res.status(200).json({ timeToLife, expTime });
};

// Renovar tiempo de vida del token
export const updateToken = (req: Request, res: Response) => {
  const { userID } = req.params;
  const ttl = cache.getTtl(userID);

  if (!ttl) {
    return res.status(404).json({ error: "Token no encontrado" });
  }

  cache.ttl(userID, 60 * 15);
  res.json({ message: "Tiempo de vida del token actualizado" });
};

// Obtener userID desde el token
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

  return res.status(200).json({ userID: payload.userID });
};

// Obtener todos los usuarios
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios", error: err });
  }
};

// Obtener usuario por username
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

// Crear nuevo usuario
export const saveUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role
    });

    const user = await newUser.save();

    return res.status(201).json({
      message: "Usuario creado exitosamente",
      user
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error al crear usuario",
      error
    });
  }
};

// Actualizar usuario (incluye modificación de roles)
export const updateUser = async (req: Request, res: Response) => {
  const { userID } = req.params;
  const { email, password, firstName, lastName, role } = req.body;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: `Usuario no encontrado` });
    }

    // Validar email si cambia
    if (email && email !== user.email) {
      const emailUsed = await User.findOne({ email });
      if (emailUsed && emailUsed._id.toString() !== userID) {
        return res.status(426).json({ message: "Email ya en uso" });
      }
      user.email = email;
    }

    // Actualizar contraseña si se envía
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role) user.role = role;

    const updatedUser = await user.save();
    return res.status(200).json({ message: 'Usuario actualizado', user: updatedUser });
  } catch (error) {
    console.error("Error en updateUser:", error);
    return res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar usuario (desactivar)
export const deleteUser = async (req: Request, res: Response) => {
  const { userID } = req.params;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: `Usuario no encontrado` });
    }

    user.status = false;
    user.deleteDate = new Date();

    const deletedUser = await user.save();
    return res.status(200).json({ deletedUser });
  } catch (error) {
    console.error("Error en deleteUser:", error);
    return res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};
