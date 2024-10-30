// components/cameraScreen/PhotoPreviewScreen.js
import React from 'react';
import { View, Image, Text, Button, StyleSheet } from 'react-native';

export default function PhotoPreviewScreen({ route, navigation }) {
  const { photoUri } = route.params; // Access the photo URI from route params

  return (
    <View style={styles.container}>
      <Text style={styles.imageText}>Your Picture</Text>
      <Image source={{ uri: photoUri }} style={styles.image} resizeMode="contain" />
      <Button title="Go Back to Camera" onPress={() => navigation.goBack()} />
      <Button title="Upload" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 300,
  },
});
