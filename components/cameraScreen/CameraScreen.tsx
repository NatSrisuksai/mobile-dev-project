import React, { useState, useRef } from 'react';
import { CameraView, CameraType } from 'expo-camera';
import { Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STORAGE } from '../../FirebaseConfig';
import { getDatabase, ref as databaseRef, push } from 'firebase/database';
import tw from 'twrnc';

const CameraScreen = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const uploadPhoto = async () => {
    if (!photoUri) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const storageRef = ref(FIREBASE_STORAGE, `users/${user.uid}/photos/${Date.now()}.jpg`);
        const response = await fetch(photoUri);
        const blob = await response.blob();

        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        const db = getDatabase();
        const imageRef = databaseRef(db, `users/${user.uid}/photos`);
        await push(imageRef, { url: downloadURL, timestamp: Date.now() });

        Alert.alert("Success", "Photo uploaded successfully!");

        resetCamera();
      } else {
        Alert.alert("Error", "No user logged in. Please log in to upload photos.");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Upload Failed", "An error occurred while uploading the photo.");
    }
  };

  const resetCamera = () => setPhotoUri(null);

  return (
    <View style={tw`flex-1 justify-center`}>
      {photoUri ? (
        <View style={tw`flex-1 items-center`}>
          <Image source={{ uri: photoUri }} style={tw`w-full h-150`} resizeMode="contain" />
          <View style={tw`absolute bottom-2 left-0 right-0 m-4 flex-row justify-between h-12`}>
            <TouchableOpacity onPress={resetCamera} style={tw`flex-1 items-center justify-center bg-blue-500 mx-2 rounded`}>
              <Text style={tw`text-white font-bold text-xl`}>Back to Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={uploadPhoto} style={tw`flex-1 items-center justify-center bg-blue-500 mx-2 rounded`}>
              <Text style={tw`text-white font-bold text-xl`}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={tw`flex-1`}>
          <CameraView style={tw`flex-1`} ref={cameraRef} facing={facing}>
            <View style={tw`absolute bottom-2 left-0 right-0 m-4 flex-row justify-between h-12`}>
              <TouchableOpacity
                style={tw`flex-1 items-center justify-center bg-blue-500 mx-2 rounded`}
                onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}>
                <Text style={tw`text-xl font-bold text-white`}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 items-center justify-center bg-green-500 mx-2 rounded`}
                onPress={takePicture}>
                <Text style={tw`text-xl font-bold text-white`}>Take Pictures</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}
    </View>
  );
}

export default CameraScreen;
