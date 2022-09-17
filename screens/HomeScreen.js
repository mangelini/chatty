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
    const sub = firestore()
      .collection('chatRooms')
      .where('members', 'array-contains', authUser.uid)
      .orderBy('modifiedAt', 'desc')
      .onSnapshot(querySnap => {
        if (querySnap) setChatRooms(querySnap.docs);
      });

    return () => sub();
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
