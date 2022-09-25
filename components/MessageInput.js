import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '../components/AppContext';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import EmojiSelector from 'react-native-emoji-selector';
import {
  XCircle,
  Send,
  Image as FImage,
  Camera,
  Smile,
} from 'react-native-feather';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TextInput,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

import {box} from 'tweetnacl';
import {encrypt, getMySecretKey, stringToUint8Array} from '../utils/crypto';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import colors from '../assets/colors/colors';

export default MessageInput = ({chatRoom}) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const authUser = useContext(UserContext);

  const resetFields = () => {
    setMessage('');
    setImage(null);
    setProgress(0);
  };

  const encryptMessage = async publicKey => {
    try {
      const privateKey = await getMySecretKey(authUser.uid);
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

  // Image picker from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaTypes: 'photo',
      quality: 1,
    });

    if (!result.didCancel) {
      setImage(result.assets[0].uri);
    }
  };

  // Photo from camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCamera({
      mediaTypes: 'photo',
      saveToPhotos: true,
    });

    if (!result.didCancel) {
      setImage(result.assets[0].uri);
    }
  };

  const getBlob = async uri => {
    const respone = await fetch(uri);
    const blob = await respone.blob();
    return blob;
  };

  const sendMessage = async () => {
    setIsLoading(true);

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
      }
    });
    setIsLoading(false);
    resetFields();
  };

  const sendImage = async () => {
    if (!image) {
      return;
    }
    const chatRoomUsers = await (
      await firestore().collection('chatRooms').doc(chatRoom.id).get()
    ).data().members;

    const childPath = `data/users/` + authUser.uid + `/photos/${uuidv4()}`;

    const blob = await getBlob(image);

    const task = storage().ref().child(childPath).put(blob);
    task.on('state_changed', taskSnap => {
      setProgress(taskSnap.bytesTransferred / taskSnap.totalBytes);
    });

    task.then(async taskSnap => {
      dUrl = await storage().ref(taskSnap.metadata.fullPath).getDownloadURL();

      chatRoomUsers.forEach(async u => {
        if (u !== authUser.uid) {
          // create message
          const messageRef = await firestore()
            .collection('messages')
            .doc(chatRoom.id)
            .collection('messages')
            .add({
              image: dUrl,
              sentAt: u,
              sentBy: authUser.uid,
              createdAt: firestore.FieldValue.serverTimestamp(),
            });

          // update last chatRoom message
          await firestore().collection('chatRooms').doc(chatRoom.id).update({
            recentMessage: messageRef.id,
            modifiedAt: firestore.FieldValue.serverTimestamp(),
          });
        }
      });

      resetFields();
    });
  };

  const onPress = () => {
    if (image) {
      sendImage();
    } else if (message) {
      sendMessage();
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, {height: isEmojiPickerOpen ? '50%' : 'auto'}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      {image && (
        <View style={styles.sendImageContainer}>
          <Image
            source={{uri: image}}
            style={{width: 100, height: 100, borderRadius: 10}}
          />

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignSelf: 'flex-end',
            }}>
            <View
              style={{
                height: 5,
                borderRadius: 5,
                backgroundColor: colors.primary,
                width: `${progress * 100}%`,
              }}
            />
          </View>

          <Pressable onPress={() => setImage(null)}>
            <XCircle size={24} color="black" style={{margin: 5}} />
          </Pressable>
        </View>
      )}

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Pressable
            onPress={() => setIsEmojiPickerOpen(currentValue => !currentValue)}>
            <Smile
              size={24}
              color={colors.textInputMessage}
              style={styles.icon}
            />
          </Pressable>

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Chatty message..."
            placeholderTextColor={colors.textInputMessage}
          />

          <Pressable onPress={pickImage}>
            <FImage
              size={24}
              color={colors.textInputMessage}
              style={styles.icon}
            />
          </Pressable>

          <Pressable onPress={takePhoto}>
            <Camera
              size={24}
              color={colors.textInputMessage}
              style={styles.icon}
            />
          </Pressable>
        </View>

        <Pressable
          disabled={isLoading}
          onPressOut={onPress}
          style={styles.buttonContainer}>
          <Send size={24} color="white" />
        </Pressable>
      </View>

      {isEmojiPickerOpen && (
        <EmojiSelector
          onEmojiSelected={emoji =>
            setMessage(currentMessage => currentMessage + emoji)
          }
          columns={8}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 10,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    backgroundColor: colors.inputMessage,
    flex: 1,
    marginRight: 10,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
    marginBottom: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    fontFamily: 'Outfit-Bold',
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendImageContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 10,
  },
});
