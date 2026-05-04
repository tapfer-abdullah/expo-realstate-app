import { useCountryStore } from "@/store/userStore";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Home = () => {
  const [isLoading, setLoading] = useState(true);
  const { allCountries, setAllCountries, savedCountries, setSavedCountries } =
    useCountryStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags",
        );
        const data: any[] = await response.json();
        console.log("Data fetched:", data);
        setAllCountries(data?.length > 50 ? data.slice(0, 50) : data);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
      <Text>Homedfffffffffffffffffffffffffffffffffffffff</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={allCountries}
          keyExtractor={(item) => item.name.common}
          renderItem={({ item }) => (
            <View className="mb-4 p-4 border rounded-lg bg-white shadow w-max ">
              <Image
                source={{ uri: item.flags.png }}
                style={{ width: 150, height: 150 }}
              />
              <Text className="font-bold">{item.name.common}</Text>
              <Text>Capital: {item.capital?.[0]}</Text>
              <Text>
                Currencies:{" "}
                {Object.values(item.currencies)
                  .map((c: any) => c.name)
                  .join(", ")}
              </Text>
              <TouchableOpacity
                onPress={() => handleToggleSaveCountry(item)}
                className="bg-blue-500 text-white p-2 rounded-lg"
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

export default Home;
