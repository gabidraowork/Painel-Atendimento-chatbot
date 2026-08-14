import { Router } from "express";
import { registerApiKey } from "../controllers/apiKey.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../schemas/apiKey.schema.js";
import { ApiKeyMiddleware } from "../middlewares/apiKey.middleware.js";
import { registerClient } from "../controllers/clients.controller.js";
const router = Router();

router.post("/api-key", authenticate, authorize("ADMIN","ATENDENTE"), registerApiKey);
router.post("/client", ApiKeyMiddleware, registerClient )

export default router;