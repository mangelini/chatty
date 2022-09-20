import React, {useEffect, useState, useContext} from 'react';
import {View, Image, Text, useWindowDimensions, Pressable} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from './AppContext';
import colors from '../assets/colors/colors';

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
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {image && (
        <Image
          source={{
            uri: image,
          }}
          style={{width: 45, height: 45, borderRadius: 30}}
        />
      )}
      <Text
        style={{
          fontFamily: 'Outfit-Bold',
          fontSize: 25,
          marginLeft: 10,
          color: colors.fontColor,
        }}>
        {fullName}
      </Text>
    </View>
  );
};
