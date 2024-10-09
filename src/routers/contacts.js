import { Router } from "express";

import * as contactControllers from "../controllers/contacts.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";

import { upload } from "../middlewares/multer.js";

import authenticate from "../middlewares/authenticate.js";

import { contactSchema, patchContactSchema  } from "../validation/contactValidation.js";

const router = Router();
router.use(authenticate);

router.get("/", ctrlWrapper(contactControllers.getAllContactsController));

router.get("/:id", isValidId, ctrlWrapper(contactControllers.getContactByIdController));

router.post("/", upload.single('photo'), validateBody(contactSchema), ctrlWrapper(contactControllers.addContactController));



router.put("/:id", upload.single('photo'), isValidId, validateBody(contactSchema), ctrlWrapper(contactControllers.upsertContactController));


router.patch("/:id", upload.single('photo'), isValidId, validateBody(patchContactSchema), ctrlWrapper(contactControllers.patchContactController));

router.delete("/:id", isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default router;
