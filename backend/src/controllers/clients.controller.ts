import { Request, Response } from "express";
import { getClients } from "../services/clients.service.js";

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