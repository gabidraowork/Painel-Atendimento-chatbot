import express from "express";
import authRoutes from "./routes/auth.routes.js"
import usersRoutes from "./routes/users.routes.js"
import clientsRoutes from "./routes/clients.routes.js"
import apiKeyRoutes from "./routes/apiKey.routes.js"
const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/clients", clientsRoutes);
app.use("/automation", apiKeyRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "API do painel de atendimento funcionando"
    });
});

export default app;
