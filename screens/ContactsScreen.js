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
import colors from '../assets/colors/colors';

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

    return ref;
  };

  const navigateToChatRoom = async user => {
    // if chatroom already exists do not create a new one
    // Currently it's not possible to create firebase queries
    // with arrays in AND logic, so we need to get firstly the
    // chatRooms of user and then check if one of it is with the
    // authUser
    const ref = await firestore()
      .collection('chatRooms')
      .where('members', 'array-contains', user.uid)
      .get();

    ref.forEach(docSnap => {
      if (docSnap.data().members.includes(authUser.uid)) {
        // This chatroom is with authUser so we don't create a new one
        // instead we redirect to the existing one
        navigation.navigate('ChatRoomScreen', {id: docSnap.id});
      }
    });

    // The loop of chatRooms didn't find one with authUser, so we create it
    const newRef = await createChatRoom(user);
    navigation.navigate('ChatRoomScreen', {id: newRef.id});
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
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
          Create ChatRoom
        </Text>
        <FlatList
          endFillColor={colors.white}
          data={contacts}
          renderItem={({item}) => (
            <ContactItem user={item} onPress={() => navigateToChatRoom(item)} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};
