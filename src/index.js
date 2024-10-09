
import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  try {

    await initMongoConnection();
    console.log("MongoDB connection established");


    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);


    setupServer();

  } catch (error) {
    console.error("Error initializing application:", error);
  }
};


void bootstrap();


