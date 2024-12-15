import { Navigate, useLocation } from 'react-router-dom';
import { FC } from 'react';

import { Preloader } from '@ui';
import { TProtectedRouteProps } from './type';
import { useSelector } from '../../services/store';

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  anonymous = false,
  children
}) => {
  const { isAuthChecked, data: user } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  const isUserAuthenticated = user.email && user.name;

  if (anonymous && isUserAuthenticated) {
    const redirectPath = location.state?.from || '/';
    return <Navigate to={redirectPath} />;
  }

  if (!anonymous && !isUserAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return <>{children}</>;
};
