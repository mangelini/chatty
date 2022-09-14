import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext} from 'react';
import {Pressable, StyleSheet, View, Text} from 'react-native';
import {UserContext} from './AppContext';

import {box} from 'tweetnacl';
import {decrypt, getMySecretKey, stringToUint8Array} from '../utils/crypto';

export default Message = props => {
  const [isMe, setIsMe] = useState(null);
  const {message: propMessage} = props;
  const [message, setMessage] = useState(propMessage);
  const [sender, setSender] = useState();
  const [receiver, setReceiver] = useState();
  const [decryptedContent, setDecryptedContent] = useState();

  const authUser = useContext(UserContext);

  useEffect(() => {
    const getUsers = async () => {
      const sender = await firestore()
        .collection('users')
        .doc(message.sentBy)
        .get();
      setSender(sender.data());

      const receiver = await firestore()
        .collection('users')
        .doc(message.sentAt)
        .get();
      setReceiver(receiver.data());
    };

    getUsers();
  }, []);

  useEffect(() => {
    const checkIfMe = async () => {
      if (!sender) {
        return;
      }
      setIsMe(sender.uid === authUser.uid);
    };
    checkIfMe();
  }, [sender]);

  useEffect(() => {
    if (
      message.messageText === undefined ||
      sender === undefined ||
      receiver == undefined
    ) {
      return;
    }

    const decryptMessage = async () => {
      const myPrivateKey = await getMySecretKey();
      if (!myPrivateKey) return;

      const sharedKey = box.before(
        stringToUint8Array(receiver.publicKey),
        myPrivateKey,
      );

      const decrypted = decrypt(sharedKey, message.messageText);
      setDecryptedContent(decrypted.message);
    };

    decryptMessage();
  }, [message, receiver]);

  return (
    <Pressable
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
      ]}>
      {!!decryptedContent && (
        <View style={styles.row}>
          <Text style={{color: isMe ? 'white' : 'black'}}>
            {decryptedContent}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    maxWidth: '75%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  leftContainer: {
    backgroundColor: '#FFFFFF',
    marginLeft: 10,
    marginRight: 'auto',
    borderTopEndRadius: 10,
    borderTopStartRadius: 0,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  rightContainer: {
    backgroundColor: '#713EFE',
    marginLeft: 'auto',
    marginRight: 10,
    alignItems: 'flex-end',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 10,
  },
});
