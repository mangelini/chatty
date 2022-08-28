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
} from 'react-native';

import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

import {User, Lock} from 'react-native-feather';
import LoginSVG from '../assets/images/react.svg';
import auth from '@react-native-firebase/auth';

import {UserRegistered} from '../components/AppContext';

export default LoginScreen = ({navigation}) => {
  const {setUserRegistered} = useContext(UserRegistered);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    try {
      setIsLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
      setUserRegistered(true);
    } catch (error) {
      if (error.code === 'auth/invalid-email')
        setErrorText('That email address is invalid!');
      else if (error.code === 'auth/user-disabled')
        setErrorText('User corresponding to the given email has been disabled');
      else if (error.code === 'auth/user-not-found')
        setErrorText('There is no user corresponding to the given email');
      else if (error.code === 'auth/wrong-password')
        setErrorText('Password is invalid for the given email');
      setModalVisible(true);
    }

    setIsLoading(false);
  };

  if (isLoading)
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
            fontSize: 40,
            fontWeight: '700',
            color: '#333',
            marginBottom: 40,
            paddingTop: 30,
            textAlign: 'center',
          }}>
          Login
        </Text>

        <InputField
          label={'Email'}
          autoCapitalize="none"
          icon={<User size={20} color="#666" style={{marginRight: 5}} />}
          textChangedFunction={setEmail}
        />

        <InputField
          label={'Password'}
          icon={<Lock size={20} color="#666" style={{marginRight: 5}} />}
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
          <Text>New to the app? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{color: '#703DFE', fontWeight: '700'}}> Register</Text>
          </TouchableOpacity>
        </View>
        <Modal
          style={{justifyContent: 'center'}}
          backdropColor={'white'}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modals}>
            <Text
              style={{
                alignSelf: 'center',
                width: 600,
                textAlign: 'center',
              }}>
              {errorText}
            </Text>
            <Pressable
              style={[styles.button]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modals: {
    margin: 50,
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignSelf: 'center',
  },
});
