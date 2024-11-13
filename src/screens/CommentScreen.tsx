import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { getDatabase, ref as databaseRef, onValue, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import { Comment } from '@interface/interface';

const CommentScreen = ({ route }: any) => {
  const { photoId } = route.params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getDatabase();
  const navigation = useNavigation();

  useEffect(() => {
    const commentsRef = databaseRef(db, `photos/${photoId}/comments`);
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const commentsList = Object.keys(data).map((key) => ({
        id: key,
        username: data[key].username,
        text: data[key].text,
      }));
      setComments(commentsList);
    });
  }, [photoId, db]);

  const handleAddComment = async () => {
    if (!currentUser) return;
    if (newComment.trim() === '') {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    try {
      const usernameRef = databaseRef(db, `users/${currentUser.uid}/username`);
      let username = 'Anonymous';
      onValue(usernameRef, (snapshot) => {
        username = snapshot.val() || 'Anonymous';
      });

      const commentsRef = databaseRef(db, `photos/${photoId}/comments`);
      await push(commentsRef, {
        username,
        text: newComment,
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Could not post comment. Please try again.');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`p-4 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold`}>Comments</Text>
      </View>

      <KeyboardAvoidingView
        style={tw`flex-1 p-4`}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Adjusts for keyboard on iOS
        keyboardVerticalOffset={10} 
      >
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={tw`bg-white p-3 mb-2 rounded-lg`}>
              <Text style={tw`font-bold`}>{item.username}</Text>
              <Text style={tw`text-gray-700`}>{item.text}</Text>
            </View>
          )}
        />
        <TextInput
          placeholder="Write a comment..."
          style={tw`border border-gray-300 w-full p-3 rounded-lg mb-4`}
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity
          style={tw`bg-blue-500 p-3 rounded-lg`}
          onPress={handleAddComment}
        >
          <Text style={tw`text-white text-center`}>Post Comment</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CommentScreen; 