import { Request, Response } from "express";
import { createApiKey } from "../services/apiKey.service";
export async function registerApiKey(req: Request, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            message: "Usuário não autenticado"
        });
    }

    try {
        const {name} = req.body

        if(!name || typeof name !== 'string') {
            return res.status(400).json({
                message: "O nome da API Key é obrigatório"
            });
        } 

        const { userId } = req.user;

        const newApiKey = await createApiKey(userId, name);

        return res.status(201).json({
            message: "API Key gerada com sucesso",
            apiKey: newApiKey.apiKey
        })
        
    } catch(err){
        console.log(err);

        if  ((err instanceof Error) &&
            (err.message === "Api ja cadastrada")){
                return res.status(403).json({
                    message: "Chave de Api já cadastrada"
                })
        }
        
        return res.status(500).json({
            message: "Erro interno no servidor"           
        })
    }
}