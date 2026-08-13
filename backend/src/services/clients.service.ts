import prisma from "../lib/prisma.js";
import { Role } from "../generated/prisma/enums.js";

export async function getClients(userID: number, role : Role){
    if (role === "ADMIN"){
        return await prisma.client.findMany({
            select: {
                id: true,
                phone: true,
                name: true,
                attendant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        active: true,
                    }
                }
            }
        })
    }
    else if (role === "ATENDENTE"){
        return await prisma.client.findMany({
            where: {
                attendantId: userID
            },
            select: {
                name: true,
                phone: true,
                answered: true
            }
        })
    }
    else {
        throw new Error("Role inválido")
    }
}