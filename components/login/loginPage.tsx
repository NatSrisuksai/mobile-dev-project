import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, Alert } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            navigation.replace('Main');
        } catch (error) {
            Alert.alert('L  ogin Error', error.message);
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
                <Text style={tw`text-2xl font-bold mb-6`}>Login</Text>
                <TextInput
                    style={tw`border border-gray-300 w-full p-3 mb-4 rounded-lg`}
                    placeholder="Email"
                    onChangeText={setEmail}
                    value={email}
                />
                <TextInput
                    style={tw`border border-gray-300 w-full p-3 mb-4 rounded-lg`}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />
                <Button title="Login" onPress={handleLogin} />
                <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    style={tw`mt-4`}
                >
                    <Text style={tw`text-blue-500`}>Don't have an account? Register</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LoginPage;
