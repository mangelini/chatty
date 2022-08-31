import React, {useEffect, useState, useContext} from 'react';
import {View, Image, Text, useWindowDimensions, Pressable} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from './AppContext';

export default ChatRoomHeader = ({id}) => {
  const {width} = useWindowDimensions();
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState('');
  const authUser = useContext(UserContext);

  useEffect(() => {
    if (!id) {
      return;
    }

    firestore()
      .collection('users')
      .where('chatRooms', 'array-contains', id)
      .get()
      .then(querySnap => {
        querySnap.forEach(user => {
          if (user.id !== authUser.uid) {
            setFullName(user.data().fullName);
            setImage(user.data().photoURL);
          }
        });
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        // marginLeft: 25,
        alignItems: 'center',
      }}>
      {image && (
        <Image
          source={{
            uri: image,
          }}
          style={{width: 35, height: 35, borderRadius: 30}}
        />
      )}
      <Text style={{fontWeight: 'bold', marginLeft: 10}}>{fullName}</Text>
    </View>
  );
};
