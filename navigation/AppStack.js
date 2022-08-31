import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeTabs from './HomeTabs';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import ChatRoomHeader from '../components/ChatRoomHeader';
import {ArrowLeft} from 'react-native-feather';

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
          headerTitle: () => <ChatRoomHeader id={route.params?.id} />,
          headerBackTitleVisible: false,
          // headerBackImageSource: () => <ArrowLeft />,
        })}
      />
    </Stack.Navigator>
  );
};
