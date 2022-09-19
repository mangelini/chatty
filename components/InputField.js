import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import colors from '../assets/colors/colors';

export default function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  textChangedFunction,
  fieldButtonLabel,
  fieldButtonFunction,
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
          style={{flex: 1, paddingVertical: 0, fontFamily: 'Outfit-Regular'}}
          secureTextEntry={true}
          onChangeText={textChangedFunction}
        />
      ) : (
        <TextInput
          autoCapitalize={autoCapitalize}
          placeholder={label}
          placeholderTextColor={colors.textInputMessage}
          keyboardType={keyboardType}
          style={{flex: 1, paddingVertical: 0, fontFamily: 'Outfit-Regular'}}
          onChangeText={textChangedFunction}
        />
      )}
      <TouchableOpacity onPress={fieldButtonFunction}>
        <Text style={{color: colors.primary, fontFamily: 'Outfit-Bold'}}>
          {fieldButtonLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
