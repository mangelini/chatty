import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  FlatList,
  Button,
} from 'react-native';
import {UserContext} from '../components/AppContext';
import firestore from '@react-native-firebase/firestore';
import ChatRoomItem from '../components/ChatRoomItem';

export default HomeScreen = () => {
  const authUser = useContext(UserContext);

  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(authUser.uid)
      .get()
      .then(docSnapshot => {
        setChatRooms([]);
        const ids = docSnapshot.data().chatRooms;

        if (ids)
          ids.forEach(async id => {
            const chatRoomSnap = await firestore()
              .collection('chatRooms')
              .doc(id)
              .get();

            setChatRooms(oldChatRooms => [...oldChatRooms, chatRoomSnap]);
          });
      });
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F3F3F3'}}>
      {chatRooms.length === 0 ? (
        <Text style={{alignSelf: 'center'}}>
          Start chatting with your friends!
        </Text>
      ) : (
        <FlatList
          data={chatRooms}
          renderItem={({item}) => <ChatRoomItem chatRoom={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};
