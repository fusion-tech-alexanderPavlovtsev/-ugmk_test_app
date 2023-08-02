import axiosInstance from './index';

export const getProducts = () => {
  return axiosInstance.get('products').then((r) => r.data);
};
