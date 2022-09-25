import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  Image,
  View,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {UserContext} from '../components/AppContext';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

import {box} from 'tweetnacl';
import {decrypt, getMySecretKey, stringToUint8Array} from '../utils/crypto';
import colors from '../assets/colors/colors';

export default ChatRoomItem = ({chatRoom}) => {
  const [user, setUser] = useState(); // the display user
  const [recentMessage, setRecentMessage] = useState();
  const [decryptedContent, setDecryptedContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const authUser = useContext(UserContext);

  const navigation = useNavigation();

  const dynamicDate = time => {
    const createdAt = moment(time);
    const today = moment();
    const oneWeekOld = moment().subtract(6, 'days').startOf('day');

    const yesterday = moment(today).subtract(1, 'day');

    if (moment(createdAt).isSame(today, 'day')) {
      return createdAt.format('HH:mm');
    }

    if (moment(createdAt).isSame(yesterday, 'day')) {
      return 'Yesterday';
    }
    // if (createdAt.isAfter(oneWeekOld)) {
    //   return moment(createdAt).format('dddd');
    // }
    return moment(createdAt).format('DD/MM/YYYY');
  };

  useEffect(() => {
    // fetch receiver user
    firestore()
      .collection('users')
      .where('chatRooms', 'array-contains', chatRoom.id)
      .get()
      .then(querySnap => {
        querySnap.forEach(user => {
          if (user.id !== authUser.uid) {
            setUser(user.data());
            setIsLoading(false);
          }
        });
      });
  }, []);

  useEffect(() => {
    const fetchLastMessage = async () => {
      if (chatRoom.data().recentMessage === undefined) return;

      const messageRef = await firestore()
        .collection('messages')
        .doc(chatRoom.id)
        .collection('messages')
        .doc(chatRoom.data().recentMessage)
        .get();

      setRecentMessage(messageRef.data());
    };

    fetchLastMessage();
  }, [recentMessage]);

  useEffect(() => {
    if (!recentMessage || user == undefined) return;
    if (recentMessage.messageText === undefined) {
      setDecryptedContent('Open chat to view image');
      return;
    }

    const decryptMessage = async () => {
      const myPrivateKey = await getMySecretKey(authUser.uid);
      if (!myPrivateKey) return;
      let sharedKey;

      const receiver = await (
        await firestore().collection('users').doc(recentMessage.sentAt).get()
      ).data();

      const sender = await (
        await firestore().collection('users').doc(recentMessage.sentBy).get()
      ).data();

      if (recentMessage.sentBy === authUser.uid) {
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

      const decrypted = decrypt(sharedKey, recentMessage.messageText);
      setDecryptedContent(decrypted.message);
    };

    decryptMessage();
  }, [recentMessage]);

  const onPress = () => {
    navigation.navigate('ChatRoomScreen', {id: chatRoom.id});
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  // const time = moment.unix(recentMessage?.createdAt).format('HH:mm');

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{uri: user?.photoURL}} style={styles.image} />

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.text}>
            {dynamicDate(recentMessage?.createdAt.toDate())}
          </Text>
        </View>
        <Text numberOfLines={1} style={styles.text}>
          {decryptedContent}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginRight: 10,
  },
  badgeContainer: {
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 45,
    top: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: 'Outfit-Bold',
    color: colors.fontColor,
    fontSize: 18,
    marginBottom: 3,
  },
  text: {
    color: colors.textInputMessage,
  },
});
