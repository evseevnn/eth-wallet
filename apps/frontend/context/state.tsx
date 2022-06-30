import { createContext, useContext } from 'react';
import { User } from '../generated/graphql';

const AppContext = createContext({});

export type IAppContext = {
  user?: Partial<User>;
};

export function ContextProvider({ children }) {
  let sharedState = {
    user: null,
  };

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAppContext(): IAppContext {
  return useContext(AppContext);
}
