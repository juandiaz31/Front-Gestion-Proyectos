import { createContext, useContext } from 'react';

export const RefetchContext = createContext(null);

export const useRefectch = () => {
  return useContext(RefetchContext);
};
