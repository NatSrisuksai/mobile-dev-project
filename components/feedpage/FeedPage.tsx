import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import tw from 'twrnc';
import { getDatabase, ref as databaseRef, onValue, off } from 'firebase/database';
import { getAuth } from 'firebase/auth';

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

  useEffect(() => {
    if (!currentUser) return;

    // Reference to the current user's followed users
    const followsRef = databaseRef(db, `users/${currentUser.uid}/follows`);

    // Listener for follow/unfollow updates
    const handleFollowsChange = (snapshot: any) => {
      const followsData = snapshot.val() || {};
      const followedUserIds = Object.keys(followsData).filter((id) => followsData[id]);

      if (followedUserIds.length > 0) {
        // Fetch the details of followed users
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
            .filter((user) => user.lastImage); // Include only users with images

          setFollowedUsersData(followedUsersList);
        });
      } else {
        setFollowedUsersData([]); // Clear the feed if no users are followed
      }
    };

    // Attach the listener
    onValue(followsRef, handleFollowsChange);

    // Cleanup listeners on unmount
    return () => off(followsRef, 'value', handleFollowsChange);
  }, [currentUser, db]);

  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      {followedUsersData.length > 0 ? (
        <FlatList
          data={followedUsersData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={tw`bg-white mb-4 p-4 rounded-lg shadow`}>
              <View style={tw`flex-row items-center mb-2`}>         
                <Text style={tw`text-lg font-semibold`}>{item.handle}</Text>
              </View>
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
