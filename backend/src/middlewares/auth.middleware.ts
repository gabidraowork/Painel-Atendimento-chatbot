import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/enums.js";
import prisma from "../lib/prisma.js"

function getJwtSecret(): string { 
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET){
    throw new Error("JWT_SECRET nao configurada");
    }

    return JWT_SECRET;

}


export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({
            message: "Token não fornecido"
        });
    }

    const [type, token] = authHeader.split(" ");

    if(type !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Token inválido"
        });
    }

    try {
        const payload = jwt.verify(token, getJwtSecret());

        if (typeof payload === "string") {
            return res.status(401).json({
                message: "Token inválido"
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: (payload as any).userId },
            select: { id: true, role: true, active: true }
        });

        if (!user || !user.active) {
            return res.status(401).json({
                message: "Usuário inativo ou inexistente"
            });
        }

        req.user = {
            userId: payload.userId as number,
            role: payload.role as Role
        };

        next();

    } catch(err){
        return res.status(401).json({
            message: "Token inválido ou expirado"
        })
    }
}