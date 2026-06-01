import "dotenv/config";

import connectDB from "./config/database.js";
import app from "./app.js";
import { logger } from "./utils/logger.utils.js";

const startServer = async () => {
    try {
        await connectDB();

        app.on("error", (error) => {
            logger.error('Server error', error);
            throw error;
        })

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            logger.info(`[AUTH-SERVICE] Internal Cluster Node is running on port ${PORT}`);
        })
    } catch (error) {
        logger.error('Server boot failure safely intercepted:', error);
        process.exit(1);
    }
}

startServer();
