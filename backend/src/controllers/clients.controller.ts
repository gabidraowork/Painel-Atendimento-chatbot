import { Request, Response } from "express";
import { createClient, getClients } from "../services/clients.service.js";

export async function listClients(req: Request, res: Response){

    if (!req.user) {
        return res.status(401).json({
            message: "Usuário não autenticado"
        });
    }

    const {userId, role} = req.user

    try {
        const clients = await getClients(userId, role);

        return res.status(200).json({
            clients
        })
    } catch {

        return res.status(500).json({
            message: "Erro interno no servidor"
        })
    }
}

export async function registerClient(req: Request, res: Response){

    if (!req.user){
            return res.status(401).json({
            message: "Usuário não autenticado"
        });
    }

    const { userId } = req.user;
    const { name, phone} = req.body;

    if (!name || !phone) {
        return res.status(400).json({
            message: "Bad request"
        });
    }
    try {
        const newClient = await createClient(name, phone, userId)

        return res.status(201).json({
            message: "Client criated",
            newClient
        });

    } catch (err) {
        if (!(err instanceof Error)) return;
        if(err.message === "Usuario ja existe no sistema"){
            return res.status(500).json({
            message: "Usuário já cadastrado no servidor"
        });
        }
        console.log(err);

        return res.status(500).json({
            message: "Erro interno no servidor"
        });
    }

}