import {createContext} from 'react';

export const UserContext = createContext(null);
export const UserRegistering = createContext({
  userRegistering: false,
  setUserRegistering: () => {},
});
