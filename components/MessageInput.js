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
} from 'react-native';

export default MessageInput = ({chatRoom}) => {
  const [message, setMessage] = useState('');
  const authUser = useContext(UserContext);

  const sendMessage = async () => {
    const chatRoomUsers = await (
      await firestore().collection('chatRooms').doc(chatRoom.id).get()
    ).data().members;

    chatRoomUsers.forEach(async u => {
      if (u !== authUser.uid) {
        // create message
        const messageRef = await firestore()
          .collection('messages')
          .doc(chatRoom.id)
          .collection('messages')
          .add({
            messageText: message,
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
