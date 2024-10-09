export const parsePaginationParams = (query) => {
  let page;
  let perPage;

  if (query.page && query.perPage) {
    page = parseInt(query.page, 10);
    perPage = parseInt(query.perPage, 10);
  } else {
    page = null;
    perPage = null;
  }

  return { page, perPage };
};
