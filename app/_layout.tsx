import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

const houses = [
  { id: 1, name: "House 1", price: "$100,000" },
  { id: 2, name: "House 2", price: "$150,000" },
  { id: 3, name: "House 3", price: "$200,000" },
];

export default function RootLayout() {
  return (
    <SafeAreaView>
      <View className="p-5">
        <Text className="text-lg font-bold text-center text-blue-500">
          Welcome to Expo Router!
        </Text>

        <Text style={{ fontSize: 16, textAlign: "center", marginTop: 10 }}>
          This is the root layout. You can add common UI elements here.
        </Text>

        <TextInput
          placeholder="Enter your name"
          placeholderTextColor={"gray"}
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            marginTop: 20,
            borderRadius: 5,
          }}
        />

        <TouchableOpacity
          onPress={() => alert("Search btn clicked...")}
          style={{
            backgroundColor: "blue",
            padding: 10,
            marginTop: 20,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Submit</Text>
        </TouchableOpacity>

        <FlatList
          data={houses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
              <Text style={{ color: "gray" }}>{item.price}</Text>
            </View>
          )}
          style={{ marginTop: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}
