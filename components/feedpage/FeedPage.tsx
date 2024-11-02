import React, { useState, useCallback } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { getDatabase, ref as databaseRef, onValue, off } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import tw from 'twrnc';

type User = {
  id: string;
  handle: string;
  lastImage: string;
};

const FeedPage = () => {
  const [followedUsersData, setFollowedUsersData] = useState<User[]>([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getDatabase();

  useFocusEffect(
    useCallback(() => {
      if (!currentUser) return;

      const followsRef = databaseRef(db, `users/${currentUser.uid}/follows`);

      const handleFollowsChange = (snapshot: any) => {
        const followsData = snapshot.val() || {};
        const followedUserIds = Object.keys(followsData).filter((id) => followsData[id]);

        if (followedUserIds.length > 0) {
          const usersRef = databaseRef(db, 'users');
          onValue(usersRef, (usersSnapshot) => {
            const allUsersData = usersSnapshot.val() || {};
            const followedUsersList: User[] = followedUserIds
              .map((userId) => {
                const userData = allUsersData[userId];
                return {
                  id: userId,
                  handle: userData.username,
                  lastImage: userData.photos ? Object.values(userData.photos).pop().url : '',
                };
              })
              .filter((user) => user.lastImage);

            setFollowedUsersData(followedUsersList);
          });
        } else {
          setFollowedUsersData([]);
        }
      };

      onValue(followsRef, handleFollowsChange);

      return () => off(followsRef, 'value', handleFollowsChange);
    }, [currentUser, db])
  );

  
  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      {followedUsersData.length > 0 ? (
        <FlatList
          data={followedUsersData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={tw`bg-white mb-4 p-4 rounded-lg shadow`}>
              <Text style={tw`text-lg font-semibold`}>{item.handle}</Text>
              <Image source={{ uri: item.lastImage }} style={tw`w-full h-64 rounded-lg`} />
            </View>
          )}
        />
      ) : (
        <Text style={tw`text-center text-gray-500`}>No followed users with photos to display.</Text>
      )}
    </View>
  );
};

export default FeedPage;
