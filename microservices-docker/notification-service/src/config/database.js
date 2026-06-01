import mongoose from "mongoose";
import { logger } from "../utils/logger.utils.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        logger.info(`NODE_ENV is in: ${process.env.NODE_ENV}`)
        logger.info(`Connectd to DB: ${connectionInstance.connection.host}`);
    } catch (error) {
        logger.error(`Database connectionn failed!, ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;