import { z } from "zod";
import validator from "validator"

export const registerClientSchema = z.object({
    phone: z
        .string()
        .refine(validator.isMobilePhone, "Telefone inválido"),

    name: z
        .string()
        .min(3, "Nome deve ter pelo menos 3 caracteres")
});

export const deleteClientSchema = z.object({
    phone: z
        .string()
        .refine(validator.isMobilePhone, "Telefone inválido"),
});

export const updateClientStatusSchema = z.object({
    phone: z
        .string()
        .refine(validator.isMobilePhone, "Telefone inválido"),
    
    answered: z
            .boolean()
})
