import dotenv from "dotenv";
import connectDB from "./config/connect.js";
import app from "./app.js";
import { PORT } from "./config/config.js";
import logger from "./config/logger.js";

dotenv.config();

const server = async () => {
  try {
    const db = await connectDB(process.env.MONGO_URI);

    app.listen(PORT, "0.0.0.0", () => {
    //   console.log(`DB Connected: ${db}`);
    //   console.log(`Server running on http://localhost:${PORT}`);
      logger.info(`Database Connected ${db}`);
      logger.info(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.log("Error starting server:", error.message);
    logger.error(error.message);
    process.exit(1); // 🚨 Stop server on startup failure
  }
};

server();
