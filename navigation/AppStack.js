import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import {Settings as SettingsScreen} from '../screens/Settings';
import ContactsScreen from '../screens/ContactsScreen';
import {MessageCircle, Settings, Plus} from 'react-native-feather';
import {TouchableOpacity, View} from 'react-native';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}>
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#713EFE',
      }}>
      {children}
    </View>
  </TouchableOpacity>
);

export default AppStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarActiveTintColor: '#713EFE',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#CBCBCB',
          borderRadius: 30,
          height: 110,
        },
      }}>
      <Tab.Screen
        name="HomeScreen"
        options={{
          tabBarLabel: 'Hello',
          tabBarIcon: ({color, size}) => (
            <MessageCircle color={color} size={size} />
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="ContactsScreen"
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Plus
              color="#fff"
              size={size}
              style={{
                width: 30,
                height: 30,
              }}
            />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
        component={ContactsScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          tabBarIcon: ({color, size}) => <Settings color={color} size={size} />,
        }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};
