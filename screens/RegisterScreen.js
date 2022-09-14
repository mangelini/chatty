import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {User, Lock, Image, AtSign} from 'react-native-feather';
import RegistrationSVG from '../assets/images/register.svg';
import * as ImagePicker from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import {UserRegistered} from '../components/AppContext';

import {generateKeyPair} from '../utils/crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PRIVATE_KEY = 'PRIVATE_KEY';

export default RegisterScreen = ({navigation}) => {
  const {setUserRegistered} = useContext(UserRegistered);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let dUrl = '';

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibrary();

    if (!result.didCancel) {
      setImage(result.assets[0].uri);
    }
  };

  const signUpWithEmailAndPassword = async () => {
    try {
      const userCredentials = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      await userCredentials.user.updateProfile({
        displayName: fullName,
      });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
    }
  };

  const uploadImage = async () => {
    const uid = auth().currentUser.uid;
    const childPath = `data/users/` + uid + `/profilePic`;
    let response;

    if (image) {
      response = await fetch(image);
    } else {
      response = await fetch(
        'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
      );
    }
    const blob = await response.blob();
    const snapshot = await storage().ref().child(childPath).put(blob);
    dUrl = await storage().ref(snapshot.metadata.fullPath).getDownloadURL();
  };

  const createFirestoreUser = async () => {
    try {
      // generate private and public keys and save it to local storage
      const publicKey = await createKeyPair();
      // Create user in firestore
      await firestore().collection('users').doc(auth().currentUser.uid).set({
        fullName: fullName,
        email: email,
        photoURL: dUrl,
        uid: auth().currentUser.uid,
        publicKey: publicKey,
      });
    } catch (error) {
      Alert.alert('Something went wrong while creating user');
    }
  };

  const createKeyPair = async () => {
    try {
      // generate private/public key
      const {publicKey, secretKey} = generateKeyPair();

      // save private key to Async storage
      await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());

      return publicKey.toString();
    } catch (error) {
      console.log(error);
    }
  };

  const signUp = async () => {
    if (password === confirmPassword) {
      try {
        // Do not hang while registering user
        setIsLoading(true);

        // Create authentication user
        await signUpWithEmailAndPassword();

        // Upload profile pic to firebase storage
        await uploadImage();

        // create firestore record for created user
        await createFirestoreUser();

        setUserRegistered(true);
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <SafeAreaView style={{flexGrow: 1, justifyContent: 'center'}}>
        <ActivityIndicator size={'large'} />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={{flexGrow: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center'}}>
          <RegistrationSVG
            height={180}
            width={180}
            style={{transform: [{rotate: '-5deg'}]}}
          />

          <Text
            style={{
              fontSize: 40,
              fontWeight: '700',
              color: '#333',
              marginBottom: 40,
              paddingTop: 30,
              textAlign: 'center',
            }}>
            Register
          </Text>
          <InputField
            label={'Email'}
            autoCapitalize={'none'}
            icon={<AtSign size={20} color="#666" style={{marginRight: 5}} />}
            textChangedFunction={setEmail}
            inputType="email"
          />
          <InputField
            label={'Full name'}
            autoCapitalize={'none'}
            icon={<User size={20} color="#666" style={{marginRight: 5}} />}
            textChangedFunction={setFullName}
          />
          <InputField
            label={'Password'}
            icon={<Lock size={20} color="#666" style={{marginRight: 5}} />}
            inputType="password"
            textChangedFunction={setPassword}
          />
          <InputField
            label={'Confirm password'}
            icon={<Lock size={20} color="#666" style={{marginRight: 5}} />}
            inputType="password"
            textChangedFunction={setConfirmPassword}
          />
          <View
            style={{
              flexDirection: 'row',
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
              paddingBottom: 8,
              marginBottom: 30,
            }}>
            <Image
              name="calendar-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
            <TouchableOpacity onPress={pickImage}>
              <Text style={{color: '#666', marginLeft: 5, marginTop: 5}}>
                Pick Profile Photo
              </Text>
            </TouchableOpacity>
          </View>
          <CustomButton label={'Register'} onPress={signUp} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 30,
            }}>
            <Text>Already registered?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{color: '#703DFE', fontWeight: '700'}}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
