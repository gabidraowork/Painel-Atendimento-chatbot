import { z } from "zod";

export const createApiKeySchema = z.object({
    name: z.string()
        .trim()
        .min(3, "Nome deve ter pelo menos 3 caracteres")
        .max(100)
});


