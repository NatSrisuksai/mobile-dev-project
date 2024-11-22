import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { ref, set, get } from 'firebase/database';
import tw from 'twrnc';
import AppButton from '@common/Button';
import AppTextInput from '@common/TextInput';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@type/type';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleRegister = async () => {
    try {
      const usernameRef = ref(FIREBASE_DB, `usernames/${username}`);
      const usernameSnapshot = await get(usernameRef);
      if (usernameSnapshot.exists()) {
        Alert.alert('Registration Error', 'Username already exists.');
        return;
      }
  

      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const uid = userCredential.user.uid;
  

      await set(ref(FIREBASE_DB, `users/${uid}`), { username, email });
      await set(usernameRef, uid);
  
      Alert.alert('Registration Successful', 'You can now log in.');
      navigation.navigate('Login');
    } catch (error: unknown) {
        // Type-safe error handling
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        Alert.alert('Login Error', errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={tw`flex-1 justify-center items-center bg-white px-8`}>
        <Image
          source={require('../../assets/logo_app.png')}
          style={tw`w-24 h-24 mt-20`}
          resizeMode="contain"
        />
        <Text style={tw`text-2xl font-bold mb-6`}>Register</Text>
        <AppTextInput
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
        />
        <AppTextInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
        />
        <AppTextInput
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <AppButton title="Register" onPress={handleRegister} />
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={tw`mt-4`}
        >
          <Text style={tw`text-blue-500`}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RegisterPage; 