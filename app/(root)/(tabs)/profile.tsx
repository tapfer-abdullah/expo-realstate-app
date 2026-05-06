import { useClerk, useUser } from "@clerk/expo";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Home = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  return (
    <View className="flex-1 pt-10  px-3">
      <Text className="text-xl font-bold text-center mb-2">Profile</Text>

      <Text>
        Name: {user?.firstName} {user?.lastName}
      </Text>
      <Text>Email: {user?.emailAddresses[0]?.emailAddress}</Text>

      <TouchableOpacity
        onPress={() => signOut()}
        className="bg-red-500 px-4 py-2 rounded-lg mt-4 w-max"
      >
        <Text className="text-white font-semibold text-center">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
