import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Image,
  useWindowDimensions,
} from 'react-native';
import {UserContext} from './AppContext';
import moment from 'moment';

import {box} from 'tweetnacl';
import {decrypt, getMySecretKey, stringToUint8Array} from '../utils/crypto';
import colors from '../assets/colors/colors';

export default Message = props => {
  const [isMe, setIsMe] = useState(null);
  const {message: propMessage} = props;
  const [message, setMessage] = useState(propMessage);
  const [sender, setSender] = useState();
  const [receiver, setReceiver] = useState();
  const [decryptedContent, setDecryptedContent] = useState();

  const {width} = useWindowDimensions();
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
    if (message.messageText === undefined || receiver == undefined) {
      return;
    }

    const decryptMessage = async () => {
      const myPrivateKey = await getMySecretKey(authUser.uid);
      if (!myPrivateKey) return;
      let sharedKey;

      if (isMe) {
        sharedKey = box.before(
          stringToUint8Array(receiver.publicKey),
          myPrivateKey,
        );
      } else {
        sharedKey = box.before(
          stringToUint8Array(sender.publicKey),
          myPrivateKey,
        );
      }

      const decrypted = decrypt(sharedKey, message.messageText);
      setDecryptedContent(decrypted.message);
    };

    decryptMessage();
  }, [message, sender, receiver]);

  const time = moment.unix(message?.createdAt).format('HH:mm');

  return (
    <Pressable
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
      ]}>
      <View style={styles.row}>
        {!!message.image && (
          <View style={{marginBottom: decryptedContent ? 10 : 0}}>
            <Image
              source={{uri: message.image}}
              style={{width: width * 0.65, aspectRatio: 4 / 3}}
              resizeMode="cover"
            />
          </View>
        )}

        {!!decryptedContent && (
          <View style={styles.column}>
            <View style={styles.row}>
              <Text
                style={{color: colors.fontColor, fontFamily: 'Outfit-Regular', fontSize: 16}}>
                {decryptedContent}
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={{fontFamily: 'Outfit-Regular', fontSize: 12, color: colors.textInputMessage}}>{time}</Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    maxWidth: '75%',
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  leftContainer: {
    backgroundColor: colors.grey,
    marginLeft: 10,
    marginRight: 'auto',
    borderTopEndRadius: 10,
    borderTopStartRadius: 0,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  rightContainer: {
    backgroundColor: colors.secondary,
    marginLeft: 'auto',
    marginRight: 10,
    alignItems: 'flex-end',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 10,
  },
});
