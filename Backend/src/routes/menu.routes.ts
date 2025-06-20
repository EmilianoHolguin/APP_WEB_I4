// Backend/src/routes/menu.routes.ts
import { Router } from "express";
import { createMenu, getMenuByRole } from "../controllers/menu_controllers";

const router = Router();

router.post("/create", createMenu);
router.get("/by-role/:type", getMenuByRole);

export default router;
