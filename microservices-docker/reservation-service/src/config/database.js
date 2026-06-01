import mongoose from "mongoose";
import crypto from "crypto";

// Polyfill for global Web Crypto API needed by Mongoose 9+ / MongoDB 6+ driver
if (!globalThis.crypto) {
    globalThis.crypto = crypto.webcrypto;
}
import { logger } from "../utils/logger.utils.js";

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;
                        
        const connectionInstance = await mongoose.connect(dbURI);
        logger.info(`NODE_ENV is in: ${process.env.NODE_ENV}`)
        logger.info(`Connectd to DB: ${connectionInstance.connection.host}`);
    } catch (error) {
        logger.error(`Database connectionn failed!, ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;