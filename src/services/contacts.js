import ContactCollection from "../db/models/Contact.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = "name",
  sortOrder = 1,
  filterParams = {},
}) => {
  const skip = (page - 1) * perPage;
  const [data, totalItems] = await Promise.all([
    ContactCollection.find(filterParams)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
    ContactCollection.countDocuments(filterParams),
  ]);

  return {
    data,
    totalItems,
  };
};

export const getContact = (filter) => ContactCollection.findOne(filter);

export const createContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (filter, data, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(filter, data, {
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = (filter) => ContactCollection.findOneAndDelete(filter);

export const buildContactsQuery = ({
  sortBy = "name",
  sortOrder = 1,
  filterParams = {},
}) => {
  return ContactCollection.find(filterParams).sort({ [sortBy]: sortOrder });
};

export const countContacts = (filterParams) => {
  return ContactCollection.countDocuments(filterParams);
};
