import express from "express";
import authRoutes from "./routes/auth.routes.js"
const app = express();

app.use(express.json());
app.use("/auth", authRoutes)

app.get("/", (req, res) => {
    res.json({
        message: "API do painel de atendimento funcionando"
    });
});

export default app;
