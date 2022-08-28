import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  FlatList,
  Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';

export const Settings = () => {
  const logOut = async () => {
    await auth().signOut();
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <Button title="Log out" onPress={logOut} />
    </SafeAreaView>
  );
};
