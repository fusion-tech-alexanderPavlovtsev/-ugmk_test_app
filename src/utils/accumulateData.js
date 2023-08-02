/* eslint no-param-reassign: "off" */
import { textsForMonth } from '../constants';

const accumulateData = (rawData) => {
  const groupedData = rawData.reduce(
    (monthData, { date, factory_id, product1, product2 }) => {
      const month = date?.substring(
        date.indexOf('/') + 1,
        date.lastIndexOf('/')
      );
      monthData[month] ??= {
        month,
        monthText: textsForMonth[month],
        1: { product1: 0, product2: 0, common: 0 },
        2: { product1: 0, product2: 0, common: 0 },
      };
      if (factory_id === 1 || factory_id === 2) {
        const product1InTons = Math.round(product1 / 1000);
        const product2InTons = Math.round(product2 / 1000);
        const sumProducts = product1InTons + product2InTons;
        monthData[month][factory_id].product1 += product1InTons;
        monthData[month][factory_id].product2 += product2InTons;
        monthData[month][factory_id].common += sumProducts;
        return monthData;
      }
      return monthData;
    },
    {}
  );

  return Object.values(groupedData).filter((item) => item.month);
};

export default accumulateData;
