import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
import logger from "./utils/logger";
dotenv.config();

// const PORT = process.env.PORT || 5000;
const PORT: number = Number(process.env.PORT) || 5000;
// Connect to MongoDB
connectDB().then(() => {
  // Start Express server only after DB connection is successful

  app.listen(PORT,"0.0.0.0", () => {
     logger.info(`Server running on port ${PORT}`);
    // console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  logger.error("Failed to connect to MongoDB:", error);
  process.exit(1);
});
