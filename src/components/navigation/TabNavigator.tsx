import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../../screens/HomeScreen';
import FeedPage from '../../screens/FeedPage';
import SearchPage from '../../screens/SearchPage';
import CameraScreen from '../../screens/CameraScreen';
import ExitScreen from '../../screens/ExitScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Feed') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Camera') iconName = focused ? 'camera' : 'camera-outline';
          else if (route.name === 'Exit') iconName = focused ? 'exit' : 'exit-outline';
          return <Ionicons name={iconName || "default-icon-name"} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E86C1',
        tabBarInactiveTintColor: '#BDC3C7',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 80,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Feed" component={FeedPage} options={{ tabBarLabel: 'Feed' }} />
      <Tab.Screen name="Search" component={SearchPage} options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen name="Camera" component={CameraScreen} options={{ tabBarLabel: 'Camera' }} />
      <Tab.Screen name="Exit" component={ExitScreen} options={{ tabBarLabel: 'Exit' }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;