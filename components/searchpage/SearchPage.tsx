import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, SafeAreaView } from 'react-native';
import { getDatabase, ref as databaseRef, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import tw from 'twrnc';

interface User {
  id: string;
  handle: string;
  followed: boolean;
}

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [results, setResults] = useState<User[]>([]);
  const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>({});
  const auth = getAuth();
  const db = getDatabase();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      // Fetch list of all users
      const usersRef = databaseRef(db, 'users');
      onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val() || {};
        const usersList = Object.keys(usersData)
          .filter((userId) => userId !== currentUser.uid) // Exclude the current user
          .map((userId) => ({
            id: userId,
            handle: usersData[userId].username,
            followed: false, // Default followed state
          }));
        setAllUsers(usersList);
      });

      // Fetch the current user's followed users
      const followsRef = databaseRef(db, `users/${currentUser.uid}/follows`);
      onValue(followsRef, (snapshot) => {
        const followsData = snapshot.val() || {};
        setFollowedUsers(followsData);
      });
    }
  }, [currentUser, db]);

  useEffect(() => {
    // Update results based on follow status and search query
    if (query.trim() === '') {
      // Show only followed users by default if no query
      setResults(
        allUsers
          .filter((user) => followedUsers[user.id])
          .map((user) => ({
            ...user,
            followed: true,
          }))
      );
    } else {
      // Show both followed and unfollowed users matching the search query
      setResults(
        allUsers
          .filter((user) => user.handle && user.handle.toLowerCase().includes(query.toLowerCase()))
          .map((user) => ({
            ...user,
            followed: !!followedUsers[user.id],
          }))
      );
    }
  }, [query, allUsers, followedUsers]);

  const toggleFollow = async (userId: string) => {
    if (!currentUser) return;

    const followsRef = databaseRef(db, `users/${currentUser.uid}/follows/${userId}`);
    const isCurrentlyFollowing = followedUsers[userId];

    try {
      if (isCurrentlyFollowing) {
        // Unfollow user
        await set(followsRef, null);
      } else {
        // Follow user
        await set(followsRef, true);
      }

      setFollowedUsers((prev) => ({
        ...prev,
        [userId]: !isCurrentlyFollowing,
      }));
    } catch (error) {
      console.error("Error updating follow status:", error);
      Alert.alert("Error", "Could not update follow status. Please try again.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => setQuery('');
    }, [])
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-1 bg-gray-100 p-4`}>
        <TextInput
          placeholder="Search by handle name"
          style={tw`border border-gray-300 w-full p-3 mb-4 rounded-lg`}
          onChangeText={setQuery}
          value={query}
        />
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <Text style={tw`text-lg`}>{item.handle}</Text>
              <TouchableOpacity
                onPress={() => toggleFollow(item.id)}
                style={tw`p-2 px-4 rounded-lg ${item.followed ? 'bg-red-500' : 'bg-green-500'}`}
              >
                <Text style={tw`text-white`}>{item.followed ? 'Unfollow' : 'Follow'}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchPage;
