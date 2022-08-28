import React, {useState, useEffect, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';
import {View, Text} from 'react-native';

import {UserContext, UserRegistered} from './components/AppContext';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [userRegistered, setUserRegistered] = useState(false);
  const provided = useMemo(
    () => ({userRegistered, setUserRegistered}),
    [userRegistered],
  );

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <NavigationContainer>
      {user && userRegistered ? (
        <>
          <UserContext.Provider value={user}>
            <AppStack />
          </UserContext.Provider>
        </>
      ) : (
        <UserRegistered.Provider value={provided}>
          <AuthStack setUserRegistered={setUserRegistered} />
        </UserRegistered.Provider>
      )}
    </NavigationContainer>
  );
};

export default App;
