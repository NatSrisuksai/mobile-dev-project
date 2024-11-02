import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { ref, get } from 'firebase/database';
import tw from 'twrnc';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            // Check if the username exists and retrieve the associated email
            const usernameRef = ref(FIREBASE_DB, `usernames/${username}`);
            const usernameSnapshot = await get(usernameRef);

            if (!usernameSnapshot.exists()) {
                Alert.alert('Login Error', 'Username does not exist.');
                return;
            }

            // Get the UID associated with the username
            const uid = usernameSnapshot.val();
            
            // Use UID to fetch the user data (including email)
            const userRef = ref(FIREBASE_DB, `users/${uid}`);
            const userSnapshot = await get(userRef);

            if (userSnapshot.exists()) {
                const email = userSnapshot.val().email;

                // Sign in with the retrieved email and entered password
                await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
                navigation.replace('Main');
            } else {
                Alert.alert('Login Error', 'User data not found.');
            }
        } catch (error) {
            Alert.alert('Login Error', error.message);
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
                    placeholder="Username"
                    onChangeText={setUsername}
                    value={username}
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
