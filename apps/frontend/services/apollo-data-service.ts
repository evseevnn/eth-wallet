import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

const httpLink = new HttpLink({ uri: process.env.GRAPHQL_URL });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization:
        (typeof window !== 'undefined' &&
          `Bearer ${localStorage.getItem('accessToken')}`) ||
        undefined,
    },
  }));

  return forward(operation);
});

export const apolloDataService = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});
