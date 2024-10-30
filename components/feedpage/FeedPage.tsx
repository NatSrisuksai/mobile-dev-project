import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import tw from 'twrnc';

type User = {
  id: string;
  handle: string;
  profilePic: any;
  lastImage: any;
};

const FeedPage = () => {
  const followedUsers: User[] = [
    { id: '1', handle: 'john_doe', profilePic: require('../../assets/messi.png'), lastImage: require('../../assets/messi.png') },
    { id: '2', handle: 'jane_smith', profilePic: require('../../assets/ronaldo.png'), lastImage: require('../../assets/ronaldo.png') },
    { id: '3', handle: 'jane_smith', profilePic: require('../../assets/ronaldo.png'), lastImage: require('../../assets/ronaldo.png') },
  ];

  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      <FlatList
        data={followedUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={tw`bg-white mb-4 p-4 rounded-lg shadow`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Image source={item.profilePic} style={tw`w-10 h-10 rounded-full mr-3`} />
              <Text style={tw`text-lg font-semibold`}>{item.handle}</Text>
            </View>
            <Image source={item.lastImage} style={tw`w-full h-64 rounded-lg`} />
          </View>
        )}
      />
    </View>
  );
};

export default FeedPage;
