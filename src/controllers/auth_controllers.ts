import { Request, Response } from 'express';
import { cache } from '../utils/cache';
import { generateToken } from '../utils/token';
import dayjs from 'dayjs';
import { verifyAccessToken } from "../utils/token";
import {User} from "../models/user";
import bcrypt from 'bcrypt';

export const loginMethod = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Buscar el usuario por nombre de usuario
    const user = await User.findOne({ username });

    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Verificar si el usuario está activo
    if (user.status === false) {
      return res.status(403).json({ message: "El usuario está inactivo" });
    }

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token
    const accessToken = generateToken(user._id.toString());

    // Guardar en caché
    cache.set(
      user._id.toString(),
      {
        token: accessToken,
        name: `${user.firstName} ${user.lastName}`,
        createdAt: Date.now(),
      },
      60 * 15 // TTL: 15 minutos
    );

    // Excluir contraseña del response
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
    if(!ttl){
        return res.status(404).json({message: "Token no encontrado"});
    }

    const now = Date.now();
    const timeToLife = Math.floor((ttl-now)/1000);
    const expTime = dayjs(ttl).format('HH:mm:ss');

    return res.status(200).json({
        timeToLife: timeToLife,
        expTime: expTime
    })
}

export const updateToken = (req: Request, res: Response) => {
    const { userID } = req.params;
    const ttl = cache.getTtl(userID);
        if (!ttl) {
            return res.status(404).json({ error: "Token no encontrado" });
        }
    const newTimeToken: number = 60 * 15;
    cache.ttl(userID, newTimeToken); //actualiza el tiempo de vida del token

    res.json({ message: "Tiempo de vida del token actualizado" });
}

export const getUserIdFromToken = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
   }
    }
// Obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios", error: err });
  }
};

//Obtener a los usuarios por usernake
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


export const saveUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, username, email, password, role } = req.body;

        // Generar salt
        const salt = await bcrypt.genSalt(10);
        // Hashear password
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword, // Guardamos contraseña cifrada
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

export const updateUser = async (req: Request, res: Response) => {
    const { userID } = req.params;
    const { email, password, firstName, lastName, role} = req.body

    const user = await User.findById(userID);
    if(!user){
        return res.status(404).json({message: `User not found`});
    }

    const userEmail = await User.findOne({email});
    if(userEmail){
        return res.status(426).json({message: `Email already used`});
    }

    user.password = password != null ? password : user.password;
    user.email = email;
    user.role = role;
    user.firstName = firstName;
    user.lastName = lastName;

    const updateUser = await user.save();
    return res.status(200).json({updateUser});
}

export const deleteUser = async (req: Request, res: Response) => {
    const { userID } = req.params;

    const user = await User.findById(userID);
    if(!user){
        return res.status(404).json({message: `User not found`});
    }

    user.status = false;
    user.deleteDate = new Date;
    const deleteUser = await user.save();
    return res.status(200).json({deleteUser})
}