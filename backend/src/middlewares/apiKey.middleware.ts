import {Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js"
import crypto from "node:crypto"
import { Role } from "../generated/prisma/enums.js";

export async function ApiKeyMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const apiKey = req.header("x-api-key");

        if(!apiKey){
            return res.status(401).json({
                message: "API key nao fornecida"
            })
        }

        const keyHash = crypto.createHash("sha256")
                                .update(apiKey)
                                .digest("hex")

        const existingApiKey = await prisma.apiKey.findFirst({
            where: {
                keyHash,
                active: true
            }
        })

        if(!existingApiKey || !existingApiKey.active){
            return res.status(401).json({
                message: "API key inválida ou inativa"
            })
        }

        req.user = {
            userId: existingApiKey.userId as number,
            role: "ATENDENTE" as Role
        };

        next()

    } catch(err){
        console.log(err);

        return res.status(500).json({
            message: "Erro interno no servidor"
        })
    }
}
