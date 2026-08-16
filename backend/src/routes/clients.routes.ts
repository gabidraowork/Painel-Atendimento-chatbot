import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { listClients, registerClient, deleteClient, updateStatus } from "../controllers/clients.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerClientSchema, deleteClientSchema, updateClientStatusSchema } from "../schemas/clients.schema.js";

const router = Router();

router.get("/", authenticate, authorize("ATENDENTE","ADMIN"), listClients);
router.post("/", validate(registerClientSchema), authenticate, authorize("ATENDENTE"), registerClient)
router.delete("/", validate(deleteClientSchema), authenticate, authorize("ADMIN", "ATENDENTE"), deleteClient )
router.patch("/answered", validate(updateClientStatusSchema), authenticate, authorize("ADMIN", "ATENDENTE"), updateStatus )

export default router;