import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { FC, useEffect } from 'react';

import { fetchFeeds } from '../../services/slices';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { isLoading, data } = useSelector((state) => state.feeds);
  /** TODO: взять переменную из стора */
  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);
  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };
  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <FeedUI orders={data.orders} handleGetFeeds={handleGetFeeds} />
      )}
    </>
  );
};
