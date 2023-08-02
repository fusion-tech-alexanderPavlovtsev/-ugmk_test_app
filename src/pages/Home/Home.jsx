import { useEffect, useMemo, useReducer } from 'react';

import { getProducts } from '../../api/products';

import accumulateData from '../../utils/accumulateData';
import {
  getFilterFromStorage,
  setFilterToStorage,
} from '../../utils/workWithLocalStorage';

import {
  ERROR_TEXT,
  INITIAL_PRODUCT_SELECTION,
  optionsForSelector,
  textForFabrics,
} from '../../constants';

import BarChartHome from './components/BarChart';
import Selector from './components/Selector';
import Loader from '../../components/Loader';

import styles from './Home.module.css';

function getInitialSelection() {
  const savedFilter = getFilterFromStorage();
  if (!savedFilter) {
    return INITIAL_PRODUCT_SELECTION;
  }
  return savedFilter;
}

function reducer(state, action) {
  switch (action.type) {
    case 'set_filter': {
      return {
        ...state,
        filter: action.filter,
      };
    }
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
    // no default
  }
}

const initialState = {
  filter: getInitialSelection(),
  products: [],
  isLoading: false,
  isError: false,
};

function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dataForGraph = useMemo(() => {
    const resourceForGraph = accumulateData(state.products);
    const selectedProduct = state.filter.selector;
    return resourceForGraph?.map((item) => ({
      month: item.month,
      monthText: item.monthText,
      [textForFabrics.factory_1]: item[1][selectedProduct],
      [textForFabrics.factory_2]: item[2][selectedProduct],
    }));
  }, [state.filter, state.products]);

  const handleClickSelectorOption = (newFilter) => {
    setFilterToStorage(newFilter);
    dispatch({
      type: 'set_filter',
      filter: newFilter,
    });
  };

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
    <div className={styles.wrapper}>
      <Selector
        filter={state.filter}
        options={optionsForSelector}
        handleClick={handleClickSelectorOption}
      />
      {state.isLoading && <Loader />}
      {state.isError && <div className={styles.error}>{ERROR_TEXT}</div>}
      {!!dataForGraph?.length && <BarChartHome data={dataForGraph} />}
    </div>
  );
}

export default Home;
