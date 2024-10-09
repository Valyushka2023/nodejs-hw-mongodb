import * as contactServices from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { parseContactFilterParams } from "../utils/filters/parseContactFilterParams.js";
import createHttpError from "http-errors";
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

import saveFileToCloudinary from "../utils/saveFileToCloudinary.js";
import { env } from '../utils/env.js';

const enableCloudinary = env("ENABLE_CLOUDINARY");

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filterParams = parseContactFilterParams(req.query);
  const { _id: userId } = req.user;

  let contactsQuery = contactServices.buildContactsQuery({
    sortBy,
    sortOrder,
    filterParams: { ...filterParams, userId },
  });

  if (page && perPage) {
    contactsQuery = contactsQuery.skip((page - 1) * perPage).limit(perPage);
  }

  const contacts = await contactsQuery;

  const totalItems = await contactServices.countContacts({ ...filterParams, userId });

  const pagination = calculatePaginationData(totalItems, page, perPage);

  res.json({
    status: 200,
    message: "Contacts found successfully!",
    data: {
      data: contacts,
      page: page || 1,
      perPage: perPage || totalItems,
      totalItems,
      totalPages: pagination.totalPages || 1,
      hasNextPage: pagination.hasNextPage || false,
      hasPreviousPage: pagination.hasPreviousPage || false,
    },
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.getContact({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, "Contact not found");
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  let photo;
  if (req.file) {
    if (enableCloudinary === "true") {
        photo = await saveFileToCloudinary(req.file, "photos");
    }
    else {
        photo = await saveFileToUploadDir(req.file);
    }
  }

    const { _id: userId } = req.user;
    const data = await contactServices.createContact({ ...req.body, userId, photo });

    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data,
    });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const { isNew, data } = await contactServices.updateContact({ _id: id, userId }, req.body, { upsert: true });

  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: "Contact upserted successfully",
    data,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;


if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await contactServices.updateContact(contactId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    throw createHttpError(404, "Contact not found");
  }

  res.json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.deleteContact({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(204).send();
};
