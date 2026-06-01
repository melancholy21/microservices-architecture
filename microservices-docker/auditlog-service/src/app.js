import express from "express";
import auditRoutes from "./routes/audit.routes.js";

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'audit-log-engine' });
});

app.use('/api/v1/audit', auditRoutes);

export default app;