import {FlashList} from '@shopify/flash-list';
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
import ContactItem from '../components/ContactItem';
import {UserContext} from '../components/AppContext';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

export default ContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const authUser = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    firestore()
      .collection('users')
      .where('uid', '!=', authUser.uid)
      .get()
      .then(querySnapshot => {
        // clean data used in past cycle
        setContacts([]);

        querySnapshot.forEach(doc => {
          setContacts(oldContacts => [...oldContacts, doc.data()]);
        });
      });
  }, []);

  const createChatRoom = async user => {
    const ref = await firestore()
      .collection('chatRooms')
      .add({
        type: 'private',
        createdAt: firestore.FieldValue.serverTimestamp(),
        createdBy: authUser.uid,
        members: [user.uid, authUser.uid],
      });

    // Add chatRoom to users profile
    await firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        chatRooms: firestore.FieldValue.arrayUnion(ref.id),
      });
    await firestore()
      .collection('users')
      .doc(authUser.uid)
      .update({
        chatRooms: firestore.FieldValue.arrayUnion(ref.id),
      });
  };

  // const navigateToChatRoom = async user => {
  //   // if chatroom already exists do not create a new one
  //   const res = await firestore()
  //     .collection('chatRooms')
  //     .where('members', 'not-in', [user.uid, authUser.uid])
  //     .get();

  //   console.log(res.empty);

  //   if (res.empty) {
  //     const ref = await createChatRoom(user);
  //     navigation.navigate('ChatRoomScreen', {id: ref.id});
  //   } else navigation.navigate('ChatRoomScreen', {id: res.docs[0].id});
  // };

  return (
    <SafeAreaView>
      <FlatList
        data={contacts}
        renderItem={({item}) => (
          <ContactItem user={item} onPress={() => createChatRoom(item)} />
        )}
      />
    </SafeAreaView>
  );
};
