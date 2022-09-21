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
import colors from '../assets/colors/colors';

export default HomeScreen = () => {
  const authUser = useContext(UserContext);

  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const sub = firestore()
      .collection('chatRooms')
      .orderBy('modifiedAt', 'desc')
      .onSnapshot(querySnap => {
        setChatRooms([])
        querySnap.forEach(doc => {
          if(doc.data().members.includes(authUser.uid))
            setChatRooms(oldChats => [...oldChats, doc])
        })
      });

    return () => sub();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {chatRooms.length === 0 ? (
        <Text style={{justifyContent: 'center', alignSelf: 'center'}}>
          Start chatting with your friends!
        </Text>
      ) : (
        <View>
          <Text
            style={{
              fontFamily: 'Outfit-Bold',
              fontSize: 30,
              color: colors.fontColor,
              marginBottom: 40,
              paddingTop: 30,
              paddingLeft: 20,
              textAlign: 'left',
            }}>
            Your ChatRooms
          </Text>
          <FlatList
            data={chatRooms}
            renderItem={({item}) => <ChatRoomItem chatRoom={item} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
