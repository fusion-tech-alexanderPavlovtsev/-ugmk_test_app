import { useState } from 'react';

import { SELECTOR_TITLE } from '../../../../constants';

import styles from './Selector.module.css';

const Selector = ({ filter, options, handleClick }) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleClickSelector = () => {
    setIsOpened(!isOpened);
  };

  const handleClickOption = (newFilter) => {
    handleClick(newFilter);
    setIsOpened(false);
  };

  return (
    <div className={styles.selector}>
      <p>{SELECTOR_TITLE}</p>
      <div className={styles.selected} onClick={handleClickSelector}>
        {filter.title}
        {isOpened && (
          <div className={styles.options}>
            {options.map((item, index) => (
              <div
                className={styles.option}
                key={index}
                onClick={() => handleClickOption(item)}
              >
                {item.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Selector;
