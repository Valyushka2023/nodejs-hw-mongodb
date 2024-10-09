export const calculatePaginationData = (totalItems, page, perPage) => {
  if (!page || !perPage) {
    return {};
  }

  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};
