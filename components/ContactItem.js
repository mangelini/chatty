import React, {useEffect} from 'react';
import {StyleSheet, Pressable, Image, View, Text} from 'react-native';
import colors from '../assets/colors/colors';

export default ContactItem = ({user, onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{uri: user.photoURL}} style={styles.image} />
      <View style={styles.rightContainer}>
        <Text style={styles.name}>{user.fullName}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginRight: 10,
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
    fontFamily: 'Outfit-Bold',
    color: colors.fontColor,
    fontSize: 18,
    marginBottom: 3,
  },
});
