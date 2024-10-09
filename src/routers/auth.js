import { Router } from "express";
import * as authControllers from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { registerUserSchema, loginUserSchema } from "../validation/auth.js";
import { validateBody } from "../middlewares/validateBody.js";

import { requestResetEmailSchema } from '../validation/auth.js';
import { requestResetEmailController } from '../controllers/auth.js';

import { resetPasswordSchema } from '../validation/auth.js';
import { resetPasswordController } from '../controllers/auth.js';


const router = Router();

router.post(
  "/register",
  validateBody(registerUserSchema),
  ctrlWrapper(authControllers.registerUserController)
);

router.post(
  "/login",
  validateBody(loginUserSchema),
  ctrlWrapper(authControllers.loginUserController)
);

router.post(
  "/refresh",
  ctrlWrapper(authControllers.refreshController)
);

router.post(
  "/logout",
  ctrlWrapper(authControllers.logoutController)
);



router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
