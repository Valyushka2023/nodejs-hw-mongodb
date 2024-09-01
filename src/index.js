import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

const bootstrap = async () => {
  try {
  
    await initMongoConnection();
    console.log("MongoDB connection established");


    setupServer();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

bootstrap();
