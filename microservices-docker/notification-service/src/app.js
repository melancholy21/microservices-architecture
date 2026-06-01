import express from "express";
import notificationRouter from "./routes/notification.routes.js";

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'notification-service-engine' });
});

app.use("/api/v1/notifications", notificationRouter)

export default app;