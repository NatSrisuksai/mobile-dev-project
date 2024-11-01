import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import tw from 'twrnc';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { onValue, ref as databaseRef, getDatabase } from 'firebase/database';

const HomeScreen = () => {
  const [userImages, setUserImages] = useState<string[]>([]);
  const user = FIREBASE_AUTH.currentUser;


  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const imageRef = databaseRef(db, `users/${user.uid}/photos`);

      const unsubscribe = onValue(imageRef, (snapshot) => {
        if (snapshot.exists()) {
          const images = Object.values(snapshot.val()).map((item) => item.url);
          setUserImages(images);
        }
      });

      return () => unsubscribe();
    }
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
