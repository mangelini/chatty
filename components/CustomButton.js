import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../assets/colors/colors';

export default function CustomButton({label, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.primary,
        paddingTop: 20,
        paddingBottom: 20,
        alignSelf: 'stretch',
        borderRadius: 10,
        marginBottom: 30,
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Outfit-Bold',
          fontSize: 16,
          color: '#fff',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
