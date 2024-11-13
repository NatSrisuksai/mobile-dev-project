import React from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { TextInputProps } from '../../interface/interface';

const AppTextInput: React.FC<TextInputProps> = ({ placeholder, value, onChangeText, secureTextEntry, style }) => {
  return (
    <RNTextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      style={[styles.input, style]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    ...tw`border border-gray-300 w-full p-3 mb-4 rounded-lg`,
  },
});

export default AppTextInput;
