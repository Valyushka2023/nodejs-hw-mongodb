import express from "express";
import cors from "cors";
import pino from "pino-http";
import { env } from "./utils/env.js";
import router from "./routers/index.js";
import cookieParser from "cookie-parser";


import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

import { UPLOAD_DIR } from './constants/index.js';

export const setupServer = () => {
  const app = express();

  const logger = pino({
    transport: {
      target: "pino-pretty",
    },
  });

  app.use(logger);
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static("uploads"));


  app.use(router);


  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = Number(env("PORT", 3000));

  app.listen(port, () => console.log(`Server is running on port  ${port}`));

  app.use('/uploads', express.static(UPLOAD_DIR));
};
