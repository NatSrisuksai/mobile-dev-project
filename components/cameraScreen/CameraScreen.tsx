import React, { useState, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Text, TouchableOpacity, View, Image, Alert, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STORAGE } from '../../FirebaseConfig';
import { getDatabase, ref as databaseRef, push } from 'firebase/database';
import tw from 'twrnc';

const CameraScreen = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
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

  const uploadPhoto = async () => {
    if (!photoUri) return;

    try {
      setIsUploading(true);
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
    } finally {
      setIsUploading(false);
    }
  };

  const resetCamera = () => setPhotoUri(null);

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={tw`flex-1 justify-center`}>
      {photoUri ? (
        <View style={tw`flex-1 items-center`}>
          <Image source={{ uri: photoUri }} style={tw`w-full h-150`} resizeMode="contain" />
          {isUploading ? (
            <ActivityIndicator size="large" color="#00ff00" style={tw`m-4`} />
          ) : (
            <View style={tw`absolute bottom-2 left-0 right-0 m-4 flex-row justify-between h-12`}>
              <TouchableOpacity onPress={resetCamera} style={tw`flex-1 items-center justify-center bg-blue-500 mx-2 rounded`}>
                <Text style={tw`text-white font-bold text-xl`}>Back to Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={uploadPhoto} style={tw`flex-1 items-center justify-center bg-blue-500 mx-2 rounded`}>
                <Text style={tw`text-white font-bold text-xl`}>Upload</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <CameraView style={tw`flex-1`} facing={facing} ref={cameraRef}>
          <View style={tw`absolute bottom-2 left-0 right-0 m-4 flex-row justify-between h-12`}>
            <TouchableOpacity
              style={tw`flex-1 items-center justify-center bg-blue-500 mx-2 rounded`}
              onPress={toggleCameraFacing}>
              <Text style={tw`text-xl font-bold text-white`}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-1 items-center justify-center bg-green-500 mx-2 rounded`}
              onPress={takePicture}>
              <Text style={tw`text-xl font-bold text-white`}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CameraScreen;
