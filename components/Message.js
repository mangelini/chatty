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
  const [user, setUser] = useState();
  const [decryptedContent, setDecryptedContent] = useState('');

  const authUser = useContext(UserContext);

  useEffect(() => {
    const getUser = async () => {
      const usr = await firestore()
        .collection('users')
        .doc(message.sentBy)
        .get();
      setUser(usr.data());
    };

    getUser();
  }, []);

  useEffect(() => {
    const checkIfMe = async () => {
      if (!user) {
        return;
      }
      setIsMe(user.uid === authUser.uid);
    };
    checkIfMe();
  }, [user]);

  useEffect(() => {
    if (!message?.content || !user?.publicKey) {
      return;
    }

    const decryptMessage = async () => {
      const myPrivateKey = await getMySecretKey();
      if (!myPrivateKey) return;

      const sharedKey = box.before(
        stringToUint8Array(user.publicKey),
        myPrivateKey,
      );
      const decrypted = decrypt(sharedKey, message.messageText);
      setDecryptedContent(decrypted.message);
    };

    decryptMessage();
  }, []);

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
