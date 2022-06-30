import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import { useAppContext } from '../context/state';
import { useGetCurrentUserQuery } from '../generated/graphql';

const withAuth = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const Router = useRouter();
      const context = useAppContext();
      const accessToken = localStorage.getItem('accessToken');

      // if no accessToken was found, then we redirect to "/login" page.
      if (!accessToken) {
        Router.replace('/login');
        return <Loader />;
      }

      // If accessToken exist, we should request user data
      const { data, loading, error } = useGetCurrentUserQuery();

      if (loading) return <Loader />;

      if (error) {
        if (error.graphQLErrors[0]?.extensions?.code === 'UNAUTHENTICATED') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          Router.replace('/login');
          return <Loader />;
        }

        Router.replace('/500');
        return <Loader />;
      }

      // If authorization is success
      if (data) {
        // Set user context
        context.user = data.user;
        if (['/join', '/signup'].includes(Router.pathname)) {
          Router.replace('/');
          return <Loader />;
        }
        return <WrappedComponent {...props} />;
      }
    }
  };
};

export default withAuth;
