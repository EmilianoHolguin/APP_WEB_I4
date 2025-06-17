//Backend/src/routes/order.routes.ts
import { Router } from "express";
import {createOrder,cancelOrder,updateOrder} from "../controllers/order_controllers";

const router = Router();

// Crear una orden
router.post("/create", createOrder);

// Cancelar una orden (soft delete: cambia el estado a "Canceled")
router.delete("/cancel/:id", cancelOrder);

// Actualizar una orden
router.put("/update/:id", updateOrder);

export default router;
