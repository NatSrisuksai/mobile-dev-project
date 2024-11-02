import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginPage from './components/login/loginPage';
import RegisterPage from './components/register/registerPage';
import HomeScreen from './components/homescreen/HomeScreen';
import FeedPage from './components/feedpage/FeedPage';
import SearchPage from './components/searchpage/SearchPage';
import CameraScreen from './components/cameraScreen/CameraScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyBMaBVY2HXa1eEL0Skc98VfbJidu12TnRo",
  authDomain: "social-media-app-4ff33.firebaseapp.com",
  databaseURL: "https://social-media-app-4ff33-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "social-media-app-4ff33",
  storageBucket: "social-media-app-4ff33.firebasestorage.app",
  messagingSenderId: "651977666525",
  appId: "1:651977666525:web:5831e2054b7fb9a6821034"
};
const TabNavigator = () => (
  <Tab.Navigator initialRouteName="Home">
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Feed" component={FeedPage} />
    <Tab.Screen name="Search" component={SearchPage} />
    <Tab.Screen name="Camera" component={CameraScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
