import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js"
import { error } from "node:console";

export async function registerUser(
    name: string,
    email: string,
    password: string
) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        },
    });

    if (existingUser) throw new Error("Email ja cadastrado");

    const hashPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashPassword,
            role: "ATENDENTE",
            active: true,
        }
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
    };
}

export async function loginUser(
    email: string,
    password: string
){
    const user = await prisma.user.findUnique({
        where:{
            email
        }
    });

    if(!user) throw new Error("Usuario nao encontrado");
    if(!user.active) throw new Error("Usuario nao ativo");
    const hashPassword = user.hashPassword;

    if (! await bcrypt.compare(password, hashPassword)) throw new Error("Senha invalida");
    const loggedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
    };

    return loggedUser;

}