import React, { useState, useCallback } from 'react';
import { View, Text, Image, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { getDatabase, ref as databaseRef, onValue, off } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

type User = {
  id: string;
  handle: string;
  lastImage: string;
  lastImageId: string;
};

const FeedPage = () => {
  const [followedUsersData, setFollowedUsersData] = useState<User[]>([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getDatabase();
  const navigation = useNavigation();

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
                const lastPhoto = userData.photos ? Object.entries(userData.photos).pop() : null;
                return lastPhoto
                  ? {
                      id: userId,
                      handle: userData.username,
                      lastImage: lastPhoto[1].url,
                      lastImageId: lastPhoto[0], // unique photo ID
                    }
                  : null;
              })
              .filter((user) => user?.lastImage) as User[];

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

  const navigateToComments = (photoId: string, handle: string, photoUrl: string) => {
    navigation.navigate('Comment', { photoId, handle, photoUrl });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-1 p-4`}>
        {followedUsersData.length > 0 ? (
          <FlatList
            data={followedUsersData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={tw`bg-white mb-4 p-4 rounded-lg shadow`}>
                <Text style={tw`text-lg font-semibold`}>{item.handle}</Text>
                <TouchableOpacity onPress={() => navigateToComments(item.lastImageId, item.handle, item.lastImage)}>
                  <Image source={{ uri: item.lastImage }} style={tw`w-full h-120 rounded-lg`} />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={tw`text-center text-gray-500`}>No followed users with photos to display.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FeedPage;
