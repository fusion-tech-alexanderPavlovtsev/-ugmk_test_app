/* eslint-disable default-case */
import { useEffect, useMemo, useReducer } from 'react';
import { useParams } from 'react-router-dom';

import { getProducts } from '../../api/products';

import accumulateData from '../../utils/accumulateData';

import {
  ERROR_TEXT,
  factoryIndexesText,
  textForProducts,
  DETAILS_TITLE,
  factoryIndexes,
} from '../../constants';

import PieChartDetails from './components/PieChart';
import Loader from '../../components/Loader';

import styles from './Details.module.css';

function reducer(state, action) {
  switch (action.type) {
    case 'set_isLoading': {
      return {
        ...state,
        isLoading: action.isLoading,
      };
    }
    case 'set_isError': {
      return {
        ...state,
        isError: true,
      };
    }
    case 'set_products': {
      return {
        ...state,
        products: action.products,
      };
    }
    case 'set_title': {
      return {
        ...state,
        title: action.title,
      };
    }
  }
}

const initialState = {
  products: [],
  isLoading: false,
  isError: false,
  title: '',
};

function Details() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { factoryId, month } = useParams();

  const dataForGraph = useMemo(() => {
    if (
      !state.products.length ||
      (factoryId !== factoryIndexes.A && factoryId !== factoryIndexes.B)
    ) {
      return [];
    }
    const resourceForGraph = accumulateData(state.products);
    const selectedData = resourceForGraph.find(
      (item) => item.month.toString() === month
    );
    const monthData = selectedData?.[factoryId];
    const monthShort = selectedData.monthText.slice(0, 3);
    const title = `${DETAILS_TITLE} ${factoryIndexesText[factoryId]} ${monthShort}`;
    dispatch({
      type: 'set_title',
      title,
    });
    return [
      {
        name: textForProducts.product1,
        value: monthData?.product1,
      },
      {
        name: textForProducts.product2,
        value: monthData?.product2,
      },
    ];
  }, [state.products, factoryId, month]);

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch({
          type: 'set_isLoading',
          isLoading: true,
        });
        const response = await getProducts();
        dispatch({
          type: 'set_products',
          products: response,
        });
      } catch (err) {
        dispatch({ type: 'set_isError' });
      } finally {
        dispatch({
          type: 'set_isLoading',
          isLoading: false,
        });
      }
    };
    getData();
  }, []);

  return (
    <div className={styles.details}>
      <h2 className={styles.title}>{state.title}</h2>
      {state.isLoading && <Loader />}
      {state.isError && <div className={styles.error}>{ERROR_TEXT}</div>}
      {!!dataForGraph.length && <PieChartDetails data={dataForGraph} />}
    </div>
  );
}

export default Details;
