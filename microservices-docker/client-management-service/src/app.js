import express from "express";
import clientRouter from "./routes/client.routes.js";

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'client-management-service-engine' });
});

app.use("/api/v1/clients", clientRouter);

export default app;