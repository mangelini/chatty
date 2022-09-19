import React, {useState, useContext} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';

import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

import {User, Lock} from 'react-native-feather';
import LoginSVG from '../assets/images/react.svg';
import auth from '@react-native-firebase/auth';

import {UserRegistering} from '../components/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../assets/colors/colors';

export default LoginScreen = ({navigation}) => {
  const {setUserRegistering, userRegistering} = useContext(UserRegistering);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      setUserRegistering(true);
      await auth().signInWithEmailAndPassword(email, password);
      const keyString = await AsyncStorage.getItem(auth().currentUser.uid);
      if (!keyString) throw new Error('privateKeyNotFound');
    } catch (error) {
      if (error.code === 'auth/invalid-email')
        Alert.alert('That email address is invalid!');
      else if (error.code === 'auth/user-disabled')
        Alert.alert('User corresponding to the given email has been disabled');
      else if (error.code === 'auth/user-not-found')
        Alert.alert('There is no user corresponding to the given email');
      else if (error.code === 'auth/wrong-password')
        Alert.alert('Password is invalid for the given email');
      else if (error === 'privateKeyNotFound') {
        await auth().signOut();
        Alert.alert('User was not created in this device');
      }
    }

    setUserRegistering(false);
  };

  if (userRegistering)
    return (
      <SafeAreaView style={{flexGrow: 1, justifyContent: 'center'}}>
        <ActivityIndicator size={'large'} />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{paddingHorizontal: 25, justifyContent: 'flex-start'}}>
        <View style={{alignItems: 'center'}}>
          <LoginSVG
            height={250}
            width={250}
            style={{transform: [{rotate: '-5deg'}]}}
          />
        </View>

        <Text
          style={{
            fontFamily: 'Outfit-Bold',
            fontSize: 40,
            color: colors.fontColor,
            marginBottom: 40,
            paddingTop: 30,
            textAlign: 'center',
          }}>
          Login
        </Text>

        <InputField
          label={'Email'}
          autoCapitalize="none"
          icon={
            <User
              size={20}
              color={colors.textInputMessage}
              style={{marginRight: 5}}
            />
          }
          textChangedFunction={setEmail}
        />

        <InputField
          label={'Password'}
          icon={
            <Lock
              size={20}
              color={colors.textInputMessage}
              style={{marginRight: 5}}
            />
          }
          inputType="password"
          fieldButtonLabel={'Forgot?'}
          fieldButtonFunction={() => {}}
          textChangedFunction={setPassword}
        />
        <View style={{paddingTop: 30}} />
        <CustomButton label={'Login'} onPress={signIn} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text style={{fontFamily: 'Outfit-Regular'}}>New to the app? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text
              style={{
                color: colors.primary,
                fontFamily: 'Outfit-Bold',
              }}>
              {' '}
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
