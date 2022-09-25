import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import colors from '../assets/colors/colors';

export default function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  textChangedFunction,
  autoCapitalize,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
      }}>
      {icon}
      {inputType == 'password' ? (
        <TextInput
          placeholder={label}
          placeholderTextColor={colors.textInputMessage}
          keyboardType={keyboardType}
          style={{
            flex: 1,
            paddingVertical: 0,
            fontFamily: 'Outfit-Regular',
            color: colors.textInputMessage,
          }}
          secureTextEntry={true}
          onChangeText={textChangedFunction}
        />
      ) : (
        <TextInput
          autoCapitalize={autoCapitalize}
          placeholder={label}
          placeholderTextColor={colors.textInputMessage}
          keyboardType={keyboardType}
          style={{
            flex: 1,
            paddingVertical: 0,
            fontFamily: 'Outfit-Regular',
            color: colors.textInputMessage,
          }}
          onChangeText={textChangedFunction}
        />
      )}
    </View>
  );
}
