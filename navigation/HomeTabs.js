import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ContactsScreen from '../screens/ContactsScreen';
import {MessageSquare, LogOut, Plus} from 'react-native-feather';
import {TouchableOpacity, View} from 'react-native';
import colors from '../assets/colors/colors';
import auth from '@react-native-firebase/auth';

const Tab = createBottomTabNavigator();

export default HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
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
        name="Home"
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
            <Plus color={color} size={size} />
          ),
          tabBarLabel: 'Contacts',
        }}
        component={ContactsScreen}
      />
      <Tab.Screen
        name="Sign Out"
        options={{
          tabBarIcon: ({color, size}) => <LogOut color={color} size={size} />,
        }}
        component={SignOut}
      />
    </Tab.Navigator>
  );
};

const SignOut = () => {
  useEffect(() => {
    const signOut = async () => {
      await auth().signOut();
    };

    signOut();
  }, []);
};
