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

export default ChatRoomItem = ({chatRoom}) => {
  const [user, setUser] = useState(); // the display user
  const [recentMessage, setRecentMessage] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const authUser = useContext(UserContext);

  const navigation = useNavigation();

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
      if (!chatRoom.data().recentMessage) return;

      const messageRef = await firestore()
        .collection('messages')
        .doc(chatRoom.id)
        .collection('messages')
        .doc(chatRoom.data().recentMessage)
        .get();
      setRecentMessage(messageRef.data());
    };

    fetchLastMessage();
  }, []);

  const onPress = () => {
    navigation.navigate('ChatRoomScreen', {id: chatRoom.id});
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  const time = moment(recentMessage?.createdAt).from(moment());

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{uri: user?.photoURL}} style={styles.image} />

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.text}>{time}</Text>
        </View>
        <Text numberOfLines={1} style={styles.text}>
          {recentMessage?.messageText}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginRight: 10,
  },
  badgeContainer: {
    backgroundColor: '#3777f0',
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
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 3,
  },
  text: {
    color: 'grey',
  },
});
