import express from "express";
import reservationRouter from "./routes/reservation.routes.js";

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'reservation-service-engine' });
});

app.use("/api/v1/reservations", reservationRouter);

export default app;