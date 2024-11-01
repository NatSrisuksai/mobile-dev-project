import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, Alert } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH , FIREBASE_DB  } from '../../FirebaseConfig';
import { ref, set, get } from 'firebase/database';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        try {
            // Check if username is already taken
            const usernameRef = ref(FIREBASE_DB, `usernames/${username}`);
            const usernameSnapshot = await get(usernameRef);
            if (usernameSnapshot.exists()) {
                Alert.alert('Registration Error', 'Username already exists.');
                return;
            }
    
            // Register the user with email and password
            const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const uid = userCredential.user.uid;
    
            // Save user data in both 'users' and 'usernames' nodes
            await set(ref(FIREBASE_DB, `users/${uid}`), { username, email });
            await set(usernameRef, uid);
    
            Alert.alert('Registration Successful', 'You can now log in.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Registration Error', error.message);
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
                <TextInput
                    style={tw`border border-gray-300 w-full p-3 mb-4 rounded-lg`}
                    placeholder="Username"
                    onChangeText={setUsername}
                    value={username}
                />
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
                <Button title="Register" onPress={handleRegister} />
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
