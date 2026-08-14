import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { listClients, registerClient } from "../controllers/clients.controller.js";
const router = Router();

router.get("/", authenticate, authorize("ATENDENTE","ADMIN"), listClients);
router.post("/", authenticate, authorize("ATENDENTE"), registerClient)

export default router;