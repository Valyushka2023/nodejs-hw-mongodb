import { Router } from "express";
import * as contactControllers from "../controllers/contacts.js";
import { ctrlWrapper } from "..//utils/ctrlWrapper.js";

const router = Router();

router.get("/", ctrlWrapper(contactControllers.getAllContactsController));
router.get("/:id", ctrlWrapper(contactControllers.getContactByIdController));
router.post("/", ctrlWrapper(contactControllers.addContactController));
router.put("/:id", ctrlWrapper(contactControllers.upsertContactController));
router.patch("/:id", ctrlWrapper(contactControllers.patchContactController));
router.delete("/:id", ctrlWrapper(contactControllers.deleteContactController));

export default router;
