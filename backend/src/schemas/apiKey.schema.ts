import { z } from "zod";

export const registerSchema = z.object({
    "x-api-key": z
        .string()
        .min(1, "Chave de Api inválida")
        .max(500, "Chave de Api inválida")
});
