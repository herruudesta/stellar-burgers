import { TRootProps } from './rootprops';
import { AppHeader } from '@components';

import { FC } from 'react';
import styles from './app.module.css';

export const Root: FC<TRootProps> = ({ children }) => (
  <div className={styles.app}>
    <AppHeader />
    {children}
  </div>
);
