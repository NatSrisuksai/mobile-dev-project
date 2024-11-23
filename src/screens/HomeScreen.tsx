import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Image, FlatList } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { onValue, ref as databaseRef, getDatabase } from 'firebase/database';
import { getStorage, ref as storageRef, getMetadata } from "firebase/storage";
import tw from 'twrnc';


const fetchMetadata = async (url: string) => {
  const storage = getStorage();
  try {
    // Extract file path from URL
    const path = decodeURIComponent(
      url.split("/o/")[1].split("?")[0] // Extract Storage path from the URL
    );

    const metadata = await getMetadata(storageRef(storage, path));
    const lastModified = new Date(metadata.updated);

    return {
      date: lastModified.toLocaleDateString(),
      time: lastModified.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  } catch (error) {
    console.error("Error fetching metadata for", url, error);
    return null;
  }
};


const HomeScreen = () => {
  const [userImages, setUserImages] = useState<
    { url: string; date?: string; time?: string }[]
  >([]);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const imageRef = databaseRef(db, `users/${user.uid}/photos`);
  
      const unsubscribe = onValue(imageRef, async (snapshot) => {
        if (snapshot.exists()) {
          const photos = Object.values(snapshot.val() as Record<string, { url: string }>);
          const imagePromises = photos.map(async ({ url }) => {
            const metadata = await fetchMetadata(url);
            return {
              url,
              date: metadata?.date.replace(' BE', ''),
              time: metadata?.time,
            };
          });
  
          const images = await Promise.all(imagePromises);
          setUserImages(images.reverse()); 
        } else {
          setUserImages([]);
        }
      });
  
      return () => unsubscribe();
    }
  }, [user]);
  

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-1 p-4`}>
        <Text style={tw`text-2xl font-bold mb-4`}>Your Uploaded Photos</Text>
        {userImages.length > 0 ? (
          <FlatList
            data={userImages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={tw`mb-6`}>
                <Image source={{ uri: item.url }} style={tw`w-full h-160 rounded-lg`} />
                {item.date && item.time && (
                  <Text style={tw`text-gray-600 text-sm text-center mt-2`}>
                    {item.date} at {item.time}
                  </Text>
                )}
              </View>
            )}
            contentContainerStyle={tw`pb-20`}
          />
        ) : (
          <Text style={tw`text-center text-gray-500`}>No images uploaded yet.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen; 