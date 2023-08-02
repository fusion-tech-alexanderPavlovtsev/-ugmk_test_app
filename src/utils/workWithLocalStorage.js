import { SELECTED_FILTER_KEY } from '../constants';

export const setFilterToStorage = (value) => {
  localStorage.setItem(SELECTED_FILTER_KEY, JSON.stringify(value));
};

export const getFilterFromStorage = () => {
  const dataJSON = localStorage.getItem(SELECTED_FILTER_KEY);
  const dataParsed = dataJSON && JSON.parse(dataJSON);
  return dataParsed;
};
