import React, {useState, useEffect, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';
import {SafeAreaView, ActivityIndicator, StatusBar} from 'react-native';

import {UserContext, UserRegistering} from './components/AppContext';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [userRegistering, setUserRegistering] = useState(false);
  const provided = useMemo(
    () => ({userRegistering, setUserRegistering}),
    [userRegistering],
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
      <SafeAreaView style={{flexGrow: 1, justifyContent: 'center'}}>
        <ActivityIndicator size={'large'} />
      </SafeAreaView>
    );

  return (
    <NavigationContainer>
      <StatusBar hidden={true} />
      {user && !userRegistering ? (
        <>
          <UserContext.Provider value={user}>
            <AppStack />
          </UserContext.Provider>
        </>
      ) : (
        <UserRegistering.Provider value={provided}>
          <AuthStack setUserRegistering={setUserRegistering} />
        </UserRegistering.Provider>
      )}
    </NavigationContainer>
  );
};

export default App;
