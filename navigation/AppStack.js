import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeTabs from './HomeTabs';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import ChatRoomHeader from '../components/ChatRoomHeader';
import {Image, TouchableOpacity} from 'react-native';

const Stack = createNativeStackNavigator();

export default AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatRoomScreen"
        component={ChatRoomScreen}
        options={({route}) => ({
          headerTitleAlign: 'center',
          headerTitle: () => <ChatRoomHeader id={route.params?.id} />,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};
