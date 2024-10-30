import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import tw from 'twrnc';

const users = [
  { id: '1', handle: 'john_doe', followed: false },
  { id: '2', handle: 'jane_smith', followed: true },
];

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(users);

  const handleSearch = () => {
    setResults(users.filter((user) => user.handle.includes(query)));
  };

  const toggleFollow = (id: string) => {
    setResults((prev) =>
      prev.map((user) => (user.id === id ? { ...user, followed: !user.followed } : user))
    );
  };

  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      <TextInput
        placeholder="Search by handle name"
        style={tw`border border-gray-300 w-full p-3 mb-4 rounded-lg`}
        onChangeText={setQuery}
      />
      <TouchableOpacity onPress={handleSearch} style={tw`mb-4 p-3 bg-blue-500 rounded-lg`}>
        <Text style={tw`text-white text-center`}>Search</Text>
      </TouchableOpacity>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text style={tw`text-lg`}>{item.handle}</Text>
            <TouchableOpacity
              onPress={() => toggleFollow(item.id)}
              style={tw`p-2 px-4 rounded-lg ${item.followed ? 'bg-red-500' : 'bg-green-500'}`}
            >
              <Text style={tw`text-white`}>{item.followed ? 'Unfollow' : 'Follow'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default SearchPage;
