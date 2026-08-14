import jwt from "jsonwebtoken";
import "dotenv/config"
import { Role } from "../generated/prisma/enums";

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET não configurada");
    }

    return secret;
}
export function generateToken(userId: number, role: Role) {
    return jwt.sign(
        {
            userId,
            role,
        },
        getJwtSecret(),
        {
            expiresIn: "1h",
        }
    );
}