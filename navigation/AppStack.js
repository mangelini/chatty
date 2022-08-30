import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeTabs from './HomeTabs';
import ChatRoomScreen from '../screens/ChatRoomScreen';

const Stack = createNativeStackNavigator();

export default AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
    </Stack.Navigator>
  );
};
