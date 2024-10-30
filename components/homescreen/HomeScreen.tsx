import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import tw from 'twrnc';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { getFirestore, doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

const HomeScreen = () => {
  const [userImages, setUserImages] = useState<string[]>([]); 
  const user = FIREBASE_AUTH.currentUser;
  const db = getFirestore();
  

  useEffect(() => {
    const fetchUserImages = async () => {
      if (user) {
        try {
          const storage = getStorage();
          const photosRef = ref(storage, `users/${user.uid}/photos/`);

          // List all files in the folder
          const result = await listAll(photosRef);

          // Fetch download URLs for each file
          const imageUrls = await Promise.all(
            result.items.map((fileRef) => getDownloadURL(fileRef))
          );

          console.log("Fetched image URLs:", imageUrls); // Log URLs to confirm
          setUserImages(imageUrls);
        } catch (error) {
          console.error("Error fetching images from Storage:", error);
        }
      }
    };
    fetchUserImages();
  }, [user]);

  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Your Uploaded Photos</Text>

      {userImages.length > 0 ? (
        <FlatList
          data={userImages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={tw`w-full h-130 mb-4 rounded-lg`} />
          )}
        />
      ) : (
        <Text style={tw`text-center text-gray-500`}>No images uploaded yet.</Text>
      )}
    </View>
  );
};

export default HomeScreen;
