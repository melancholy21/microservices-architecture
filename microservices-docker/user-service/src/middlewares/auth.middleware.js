import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.utils.js";

export const verifyUserSession = (req, res, next) => {
    try {
        // Extract token from Authorization Header (Bearer <token>)
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.warn("Access denied: No token provided to reservation engine");
            return res.status(401).json({ message: "Unauthorized: Access Token Missing" });
        }

        const token = authHeader.split(" ")[1];

        // Decode and verify token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Append the verified user ID straight into the request object!
        req.user = { id: decoded.id };

        next(); // Move forward to the controller safely
    } catch (error) {
        logger.error(`Token authorization failed: ${error.message}`);
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};