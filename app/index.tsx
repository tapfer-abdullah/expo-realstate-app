import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return <Redirect href="/(root)/(tabs)" />;

  // return (
  //   <SafeAreaView>
  //     <View className="p-4">
  //       <Text>Welcome to Expo Router!</Text>
  //     </View>
  //   </SafeAreaView>
  // );
}
