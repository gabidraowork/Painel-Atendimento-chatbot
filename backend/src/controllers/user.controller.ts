import { Request, Response } from "express";
import { getUsers } from "../services/user.service.js";

export async function listUsers(req: Request, res: Response){
    try {
        const users = await getUsers();

        return res.status(200).json({
            users
        });
    } catch {
        return res.status(500).json({
            message: "Erro interno no servidor"
        });
    }
}
