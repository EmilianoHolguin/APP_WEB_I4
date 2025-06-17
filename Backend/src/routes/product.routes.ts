//Backend/src/routes/product.routes.ts
import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product_controllers"

const router = Router();

// Crear un nuevo producto
router.post("/create", createProduct);

// Obtener todos los productos activos
router.get("/all", getAllProducts);

// Actualizar producto por ID
router.put("/update/:id", updateProduct);

// Eliminar (baja lógica) producto por ID
router.delete("/delete/:id", deleteProduct);

export default router;
