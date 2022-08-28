import {createContext} from 'react';

export const UserContext = createContext(null);
export const UserRegistered = createContext({
  userRegistered: false,
  setUserRegistered: () => {},
});
