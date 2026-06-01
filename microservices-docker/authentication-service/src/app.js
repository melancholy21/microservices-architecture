import express from "express";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'authentication-service-engine' });
});

app.use("/api/v1/users", userRouter);

export default app;