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

export async function createClient(
    name: string,
    phone: string, 
    attendantId : number){
    const existingUser = await prisma.client.findUnique({
        where: {
            attendantId_phone: {
                attendantId,
                phone
            }
        }
    });
    if(existingUser) throw new Error("Usuario ja existe no sistema");

    const newClient = await prisma.client.create({
        data: {
            name,
            phone,
            attendantId
        }
    })

    return {
        name: newClient.name,
        phone: newClient.phone,
        attendantId: newClient.attendantId
    }
}