import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service.js";

export async function register(req: Request, res: Response){
    const {name, email, password} = req.body;
    try {
    const registeredUser= await registerUser(name, email,password);
    
        res.status(201).json({
        message: "Usuário cadastrado com sucesso",
        user: registeredUser 
    });
    }catch(err) {
        if (
            err instanceof Error &&
            err.message === "Email ja cadastrado"
        ) {
            return res.status(409).json({
                message: "Email já cadastrado"
            });
        }

        console.log(err);

        return res.status(500).json({
            message: "Erro interno no servidor"
        });
    }
    
}

export async function login(req: Request, res: Response){
    const {email, password} = req.body;

    try {
        const loggedUser= await loginUser(email,password);
        
        res.status(200).json({
            message: "Usuário logado com sucesso",
            user: loggedUser
        })
    } catch(err){
         if (
            err instanceof Error &&
            (err.message === "Usuario nao encontrado" ||
            err.message === "Senha invalida")
        ) {
            return res.status(401).json({
                message: "Email ou senha incorretos"
            })
        }

        if( err instanceof Error &&
            err.message === "Usuario nao ativo"
        ){
            return res.status(401).json({
                message: "Conta desativa, contate seu administador se isso é um problema"
            })
        }

        return res.status(500).json({
            message: "Erro interno no servidor"
        });
    }

}