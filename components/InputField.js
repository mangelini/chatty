import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {Eye, EyeOff} from 'react-native-feather';
import colors from '../assets/colors/colors';

export default function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  textChangedFunction,
  autoCapitalize,
}) {
  const [hidePassword, setHidePassword] = useState(true);
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
        <>
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
            secureTextEntry={hidePassword}
            onChangeText={textChangedFunction}
          />
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            {hidePassword ? (
              <Eye color={colors.textInputMessage} />
            ) : (
              <EyeOff color={colors.textInputMessage} />
            )}
          </TouchableOpacity>
        </>
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
