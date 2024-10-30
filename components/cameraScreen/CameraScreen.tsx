import React, { useState, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import tw from 'twrnc';
import { getAuth } from 'firebase/auth';
import { ref, uploadBytes } from 'firebase/storage';
import { FIREBASE_STORAGE } from '../../FirebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-center pb-4`}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

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

  const resetCamera = () => setPhotoUri(null);

  const uploadPhoto = async () => {
    if (!photoUri) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const storageRef = ref(FIREBASE_STORAGE, `users/${user.uid}/photos/${Date.now()}.jpg`);
        const response = await fetch(photoUri);
        const blob = await response.blob();

        // Upload to Storage
        await uploadBytes(storageRef, blob);

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);

        // Save the download URL to Firestore
        const db = getFirestore();
        await addDoc(collection(db, 'users', user.uid, 'images'), {
          url: downloadURL,
          timestamp: serverTimestamp()
        });

        Alert.alert("Success", "Photo uploaded successfully!");
      } else {
        Alert.alert("Error", "No user logged in. Please log in to upload photos.");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Upload Failed", "An error occurred while uploading the photo.");
    }
  };

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
                <Text style={tw`text-xl font-bold text-white`}>Take Picture</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}
    </View>
  );
}
