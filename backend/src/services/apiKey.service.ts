import  crypto  from "node:crypto";
import prisma from "../lib/prisma";

export async function createApiKey(userId : number, name: string){
    const apiKey = crypto.randomBytes(32).toString("hex");

    const keyHash = crypto.createHash("sha256")
                            .update(apiKey)
                            .digest("hex")

    const existingApiKey = await prisma.apiKey.findFirst({
        where: {
            keyHash
        }
    })


    if(existingApiKey) throw new Error("Api ja cadastrada")
    
    const newApiKey = await prisma.apiKey.create({
        data: {
            name,
            keyHash,
            userId,
        }
    })

    return {
        name: newApiKey.name,
        apiKey: apiKey
    }
    
}