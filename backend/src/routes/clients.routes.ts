import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { listClients } from "../controllers/clients.controller.js";
const router = Router();

router.get("/", authenticate, authorize("ATENDENTE","ADMIN"), listClients);

export default router;