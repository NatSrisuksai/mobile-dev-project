import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Image, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { getDatabase, ref as databaseRef, onValue, off, set, runTransaction } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import { User, ImageData } from '@type/type';

type RootStackParamList = {
  Comment: { photoId: string; handle: string; photoUrl: string };
};

const FeedPage = () => {
  const [followedUsersData, setFollowedUsersData] = useState<User[]>([]);
  const [likesCountData, setLikesCountData] = useState<Record<string, number>>({});
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getDatabase();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
                if (lastPhoto) {
                  const [lastImageId, lastImageData] = lastPhoto as [string, ImageData]; // Cast to expected type

                  return {
                    id: userId,
                    handle: userData.username,
                    lastImage: lastImageData.url,
                    lastImageId,
                  };
                }
                return null;
              })
              .filter((user) => user) as User[];

            setFollowedUsersData(followedUsersList);

            // Attach listeners for likeCount and likeBy for each followed user's last image
            followedUsersList.forEach((user) => {
              const likeCountRef = databaseRef(db, `photos/${user.lastImageId}/likeCount`);
              onValue(likeCountRef, (likeSnapshot) => {
                const updatedLikesCount = likeSnapshot.val() || 0;
                setLikesCountData((prevData) => ({
                  ...prevData,
                  [user.lastImageId]: updatedLikesCount,
                }));
              });

              // Check if the current user has liked this photo
              const likeByRef = databaseRef(db, `photos/${user.lastImageId}/likeBy/${currentUser.uid}`);
              onValue(likeByRef, (likeBySnapshot) => {
                const isLiked = !!likeBySnapshot.val();
                setLikedPhotos((prevData) => ({
                  ...prevData,
                  [user.lastImageId]: isLiked,
                }));
              });
            });
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

  const handleDoubleTap = async (photoId: string, userId: string) => {
    if (!currentUser) return;

    const photoLikesRef = databaseRef(db, `photos/${photoId}/likeBy/${currentUser.uid}`);
    const isLiked = likedPhotos[photoId];

    // Toggle the like state in the local state
    setLikedPhotos((prev) => ({
      ...prev,
      [photoId]: !isLiked,
    }));

    const likeCountRef = databaseRef(db, `photos/${photoId}/likeCount`);

    try {
      if (isLiked) {
        // User is unliking the photo, so remove their UID and decrement like count
        await set(photoLikesRef, null); // Remove user's UID from `likeBy`

        await runTransaction(likeCountRef, (currentLikeCount) => {
          return (currentLikeCount || 0) > 0 ? currentLikeCount - 1 : 0;
        });
      } else {
        // User is liking the photo, so add their UID and increment like count
        await set(photoLikesRef, true); // Add user's UID with `true` in `likeBy`

        await runTransaction(likeCountRef, (currentLikeCount) => {
          return (currentLikeCount || 0) + 1;
        });
      }
    } catch (error) {
      console.error("Error updating like count:", error);
    }
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

                <TapGestureHandler onActivated={() => handleDoubleTap(item.lastImageId, item.id)} numberOfTaps={2}>
                  <Image source={{ uri: item.lastImage }} style={tw`w-full h-120 rounded-lg`} />
                </TapGestureHandler>

                <View style={tw`flex-row items-center mt-2`}>
                  <Ionicons
                    name={likedPhotos[item.lastImageId] ? 'heart-sharp' : 'heart-outline'}
                    size={30}
                    color={likedPhotos[item.lastImageId] ? 'red' : 'black'}
                  />
                  <Text style={tw`ml-2 text-gray-700 text-lg`}>{likesCountData[item.lastImageId] || 0}</Text>

                  <TouchableOpacity onPress={() => navigateToComments(item.lastImageId, item.handle, item.lastImage)}>
                    <Ionicons name="chatbubble-outline" size={24} color="black" style={tw`ml-4`} />
                  </TouchableOpacity>
                </View>
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