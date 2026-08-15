import { Router } from "express";
import { registerApiKey } from "../controllers/apiKey.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createApiKeySchema } from "../schemas/apiKey.schema.js";
import { ApiKeyMiddleware } from "../middlewares/apiKey.middleware.js";
import { registerClient } from "../controllers/clients.controller.js";
import { registerClientSchema } from "../schemas/clients.schema.js";
const router = Router();

router.post("/api-key", authenticate, authorize("ADMIN","ATENDENTE"), validate(createApiKeySchema), registerApiKey);
router.post("/client", validate(registerClientSchema), ApiKeyMiddleware, registerClient )

export default router;