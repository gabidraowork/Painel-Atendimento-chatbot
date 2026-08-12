import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js"
import { generateToken } from "../lib/jwt.js"
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
    
    const passwordMatch = bcrypt.compare(password, user.hashPassword);

    if (!passwordMatch) throw new Error("Senha invalida");
    const loggedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
    };

    const token = generateToken(
        user.id,
        user.role
    )

    return {
        user: loggedUser,
        token
    };

}