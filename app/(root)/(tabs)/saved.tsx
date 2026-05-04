import { useCountryStore } from "@/store/userStore";
import { Image } from "expo-image";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function Saved() {
  const { savedCountries, setSavedCountries } = useCountryStore();

  const handleUnSaveCountry = (country: any) => {
    setSavedCountries(
      savedCountries.filter((c) => c.name.common !== country.name.common),
    );
  };

  return (
    <View className="flex-1 pt-10  px-3">
      <Text className="text-xl font-bold text-center mb-2">
        Saved Countries
      </Text>
      <FlatList
        data={savedCountries}
        keyExtractor={(item) => item.name.common}
        renderItem={({ item }) => (
          <View className="mb-4 p-4 border rounded-lg bg-white shadow w-max ">
            <Image
              source={{ uri: item.flags.png }}
              style={{ width: "auto", height: 150, resizeMode: "contain" }}
              className="mx-auto "
            />
            <Text className="font-bold text-center mt-2 text-lg">
              {item.name.common}
            </Text>
            <Text className="text-center">
              Official Name: {item.name.official}
            </Text>

            <Text className="text-center">Capital: {item.capital?.[0]}</Text>
            <Text className="text-center">
              Currencies:{" "}
              {Object.values(item.currencies)
                .map((c: any) => c.name)
                .join(", ")}
            </Text>
            <TouchableOpacity
              onPress={() => handleUnSaveCountry(item)}
              className="bg-blue-500 text-white p-2 rounded-lg w-max mx-auto mt-2"
            >
              <Text>Unsave Country</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
