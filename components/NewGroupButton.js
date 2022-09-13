import React from 'react';
import {Users} from 'react-native-feather';
import {Pressable, View, Text} from 'react-native';

const NewGroupButton = ({onPress}) => {
  return (
    <Pressable onPress={onPress}>
      <View style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
        <Users size={24} color="#4f4f4f" />
        <Text style={{marginLeft: 10, fontWeight: 'bold'}}>New group</Text>
      </View>
    </Pressable>
  );
};

export default NewGroupButton;
