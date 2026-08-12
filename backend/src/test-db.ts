import prisma from "./lib/prisma.js"

async function testDatabase() {
    try {
        const users = await prisma.user.findMany();

        console.log("Conexão com o banco funcionando");
        console.log("Usuários", users);
    } catch (err){
        console.log("Erro ao conectar com o banco", err)
    } finally{
        await prisma.$disconnect();
    }
}

testDatabase()