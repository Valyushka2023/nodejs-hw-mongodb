import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

const bootstrap = async () => {
  try {
    // Очікуємо завершення підключення до бази даних
    await initMongoConnection();
    console.log("MongoDB connection established");

    // Запускаємо сервер тільки після успішного підключення
    setupServer();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

bootstrap();
