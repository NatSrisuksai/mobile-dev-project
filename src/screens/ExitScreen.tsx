import React from 'react';
import { View, Text, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import AppButton from '@common/Button';

const ExitScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await signOut(FIREBASE_AUTH);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' as never }],
            });
          } catch (error) {
            console.error("Error logging out: ", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-lg font-bold mb-4`}>Exit</Text>
      <AppButton title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ExitScreen; 