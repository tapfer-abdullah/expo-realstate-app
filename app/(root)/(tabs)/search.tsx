import { useCountryStore } from "@/store/userStore";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Search = () => {
  const { setSavedCountries, savedCountries } = useCountryStore();
  const [isLoading, setLoading] = useState(true);
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${searchQuery}?fields=name,capital,currencies,flags`,
        );
        const data: any[] = await response.json();
        setSearchResult(data?.length > 50 ? data.slice(0, 50) : data);
      } finally {
        setLoading(false);
      }
    }

    if (searchQuery) {
      setTimeout(() => {
        fetchData();
      }, 200);
    }
  }, [searchQuery]);

  const handleToggleSaveCountry = (country: any) => {
    if (!savedCountries.some((c) => c.name.common === country.name.common)) {
      setSavedCountries([...savedCountries, country]);
    } else {
      setSavedCountries(
        savedCountries.filter((c) => c.name.common !== country.name.common),
      );
    }
  };

  return (
    <View className="flex-1 pt-10  px-3">
      <Text className="text-xl font-bold text-center mb-2">
        Search Countries
      </Text>
      <View className="mb-4">
        <TextInput
          // type search
          clearButtonMode="while-editing"
          returnKeyType="search"
          placeholder="Search for a country..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="border p-2 rounded-lg"
        />
      </View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={searchResult}
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
              <Text className="text-center">Capital: {item.capital?.[0]}</Text>
              {/* official name*/}
              <Text className="text-center">
                Official Name: {item.name.official}
              </Text>

              <Text className="text-center">
                Currencies:{" "}
                {Object.values(item.currencies)
                  .map((c: any) => c.name)
                  .join(", ")}
              </Text>
              <TouchableOpacity
                onPress={() => handleToggleSaveCountry(item)}
                className="bg-blue-500 text-white p-2 rounded-lg w-max mx-auto mt-2"
              >
                <Text>
                  {savedCountries.some(
                    (c) => c.name.common === item.name.common,
                  )
                    ? "Unsave"
                    : "Save"}{" "}
                  Country
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Search;
