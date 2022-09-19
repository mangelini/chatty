import React, {useState, useEffect, useContext} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  FlatList,
} from 'react-native';
import {useRoute} from '@react-navigation/core';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../components/AppContext';
import MessageInput from '../components/MessageInput';
import Message from '../components/Message';
import colors from '../assets/colors/colors';

export default ChatRoomScreen = () => {
  const [messages, setMessages] = useState([]);
  const [chatRoom, setChatRoom] = useState(null);
  const authUser = useContext(UserContext);

  const route = useRoute();

  useEffect(() => {
    fetchChatRoom();
  }, []);

  useEffect(() => {
    const sub = firestore()
      .collection('messages')
      .doc(route.params.id)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot({
        error: () => console.log(error),
        next: querySnapshot => {
          setMessages([]);
          querySnapshot.forEach(doc => {
            setMessages(oldMessages => [...oldMessages, doc.data()]);
          });
        },
      });

    return () => sub();
  }, []);

  const fetchChatRoom = async () => {
    if (!route.params?.id) {
      console.warn('No chatroom id provided');
      return;
    }

    const chatRoom = await firestore()
      .collection('chatRooms')
      .doc(route.params.id);
    if (!chatRoom) {
      console.error("Couldn't find a chat room with this id");
    } else {
      setChatRoom(chatRoom);
    }
  };

  if (!chatRoom) return <ActivityIndicator />;

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={messages}
        inverted
        renderItem={({item}) => <Message message={item} />}
      />
      <MessageInput chatRoom={chatRoom} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
