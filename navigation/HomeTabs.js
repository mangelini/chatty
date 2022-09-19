import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import {Settings as SettingsScreen} from '../screens/Settings';
import ContactsScreen from '../screens/ContactsScreen';
import {MessageSquare, Settings, Plus} from 'react-native-feather';
import {TouchableOpacity, View} from 'react-native';
import colors from '../assets/colors/colors';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    style={{
      top: -30,
    }}
    onPress={onPress}>
    <View
      style={{
        width: 55,
        height: 55,
        borderRadius: 5,
        backgroundColor: colors.primary,
      }}>
      {children}
    </View>
  </TouchableOpacity>
);

export default HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textInputMessage,
        tabBarLabelStyle: {
          fontFamily: 'Outfit-Regular',
          fontSize: 13,
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.grey,
          height: 70,
        },
      }}>
      <Tab.Screen
        name="HomeScreen"
        options={{
          tabBarIcon: ({color, size}) => (
            <MessageSquare color={color} size={size} />
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="ContactsScreen"
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Plus color={colors.white} style={{alignItems: 'center'}} />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
          tabBarLabel: '',
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
