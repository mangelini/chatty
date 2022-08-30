import firestore from '@react-native-firebase/firestore';
import React, {useState, useEffect, useContext} from 'react';
import {Pressable, StyleSheet, View, Text} from 'react-native';
import {UserContext} from './AppContext';

export default Message = props => {
  const [isMe, setIsMe] = useState(null);
  const {message: propMessage} = props;
  const [message, setMessage] = useState(propMessage);
  const [user, setUser] = useState();

  const authUser = useContext(UserContext);

  useEffect(() => {
    const getUser = async () => {
      const usr = await firestore()
        .collection('users')
        .doc(message.sentBy)
        .get();
      setUser(usr);
    };

    getUser();
  }, []);

  useEffect(() => {
    const checkIfMe = async () => {
      if (!user) {
        return;
      }
      setIsMe(user.id === authUser.uid);
    };
    checkIfMe();
  }, [user]);

  return (
    <Pressable
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
      ]}>
      <View style={styles.row}>
        <Text style={{color: isMe ? 'black' : 'white'}}>
          {message.messageText}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  leftContainer: {
    backgroundColor: '#713EFE',
    marginLeft: 10,
    marginRight: 'auto',
  },
  rightContainer: {
    backgroundColor: 'gray',
    marginLeft: 'auto',
    marginRight: 10,
    alignItems: 'flex-end',
  },
});
