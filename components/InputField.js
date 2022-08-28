import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';

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
          keyboardType={keyboardType}
          style={{flex: 1, paddingVertical: 0}}
          secureTextEntry={true}
          onChangeText={textChangedFunction}
        />
      ) : (
        <TextInput
          autoCapitalize={autoCapitalize}
          placeholder={label}
          keyboardType={keyboardType}
          style={{flex: 1, paddingVertical: 0}}
          onChangeText={textChangedFunction}
        />
      )}
      <TouchableOpacity onPress={fieldButtonFunction}>
        <Text style={{color: '#703DFE', fontWeight: '700'}}>
          {fieldButtonLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
