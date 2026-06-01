import express from "express";
import userProfileRouter from "./routes/userProfile.routes.js";

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'user-configuration-service-engine' });
});

app.use("/api/v1/user-profiles", userProfileRouter);

export default app;