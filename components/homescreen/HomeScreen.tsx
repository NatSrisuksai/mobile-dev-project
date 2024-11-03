import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Image, FlatList } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { onValue, ref as databaseRef, getDatabase } from 'firebase/database';
import tw from 'twrnc';

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
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-1 p-4`}>
        <Text style={tw`text-2xl font-bold mb-4`}>Your Uploaded Photos</Text>
        {userImages.length > 0 ? (
          <FlatList
            data={userImages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={tw`w-full h-160 mb-4 rounded-lg`} />
            )}
            contentContainerStyle={tw`pb-20`} // Adds bottom padding to prevent overlap
          />
        ) : (
          <Text style={tw`text-center text-gray-500`}>No images uploaded yet.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
