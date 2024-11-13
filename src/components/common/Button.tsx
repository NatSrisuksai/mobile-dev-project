import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { ButtonProps } from '../../interface/interface';

const AppButton: React.FC<ButtonProps> = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    ...tw`p-3 rounded-lg bg-blue-500`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...tw`text-white font-bold`,
  },
});

export default AppButton;
