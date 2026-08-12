import jwt from "jsonwebtoken";
import "dotenv/config"

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET não configurada");
    }

    return secret;
}
export function generateToken(userId: number, role: string) {
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