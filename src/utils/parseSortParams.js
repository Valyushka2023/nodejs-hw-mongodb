import { SORT_ORDER } from '../constants/index.js';

export const parseSortParams = (query) => {
  const sortBy = query.sortBy || 'name';
  const sortOrder = query.sortOrder === SORT_ORDER.DESC ? -1 : 1;

  return { sortBy, sortOrder };
};
