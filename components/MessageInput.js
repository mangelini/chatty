import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '../components/AppContext';
import firestore from '@react-native-firebase/firestore';
import {Send} from 'react-native-feather';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';

import {box} from 'tweetnacl';
import {encrypt, getMySecretKey, stringToUint8Array} from '../utils/crypto';

export default MessageInput = ({chatRoom}) => {
  const [message, setMessage] = useState('');
  const authUser = useContext(UserContext);

  const encryptMessage = async publicKey => {
    try {
      const privateKey = await getMySecretKey();
      if (!privateKey) return;

      // let's create the shared key between auth user and receiver
      const sharedKey = await box.before(
        stringToUint8Array(publicKey),
        privateKey,
      );

      // encrypt message
      const encryptedMessage = encrypt(sharedKey, {message});

      return encryptedMessage;
    } catch (e) {
      console.log(e);
      Alert.alert('A problem occurred while trying to encrypt message');
    }
  };

  const sendMessage = async () => {
    const chatRoomUsers = await (
      await firestore().collection('chatRooms').doc(chatRoom.id).get()
    ).data().members;

    chatRoomUsers.forEach(async u => {
      if (u !== authUser.uid) {
        // retrieve actual user from uid
        const usrObj = await (
          await firestore().collection('users').doc(u).get()
        ).data();

        // encrypt message before sending it
        const encMessage = await encryptMessage(usrObj.publicKey);

        // create message
        const messageRef = await firestore()
          .collection('messages')
          .doc(chatRoom.id)
          .collection('messages')
          .add({
            messageText: encMessage,
            sentAt: u,
            sentBy: authUser.uid,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });

        // update last chatRoom message
        await firestore().collection('chatRooms').doc(chatRoom.id).update({
          recentMessage: messageRef.id,
          modifiedAt: firestore.FieldValue.serverTimestamp(),
        });

        setMessage('');
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, {height: 'auto'}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Chatty message..."
          />
        </View>
        <Pressable onPressOut={sendMessage} style={styles.buttonContainer}>
          <Send size={24} color="white" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginRight: 10,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#713EFE',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
