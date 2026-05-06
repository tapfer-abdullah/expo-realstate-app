import { useSignIn } from "@clerk/expo";
import { Image } from "expo-image";
import { Link, useRouter, type Href } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SignIn = () => {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
    fallBackError: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setLoginData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    setError((prevError) => ({
      ...prevError,
      [field]: "",
      fallBackError: "",
    }));
  };

  const handleSignIn = async () => {
    if (!loginData.email || !loginData.password) {
      setError((prevError) => ({
        ...prevError,
        email: !loginData.email ? "Email is required" : prevError.email,
        password: !loginData.password
          ? "Password is required"
          : prevError.password,
      }));
      return;
    }

    try {
      const { error } = await signIn.password({
        emailAddress: loginData.email,
        password: loginData.password,
      });

      // console.log("Sign In response:", { error, status: signIn.status });

      if (error) {
        setError({
          email: "",
          password: "",
          fallBackError:
            error.message || "An unexpected error occurred during sign in",
        });
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              return;
            }

            const url = decorateUrl("/");
            if (url.startsWith("http")) {
              if (typeof window !== "undefined") {
                window.location.href = url;
              }
              return;
            }

            router.replace(url as Href);
          },
        });
        return;
      }

      setError({
        email: "",
        password: "",
        fallBackError:
          signIn.status === "needs_second_factor"
            ? "Two-factor authentication is enabled in Clerk. Complete the second step or disable MFA in your Clerk dashboard."
            : `Sign in did not complete. Current status: ${signIn.status}`,
      });
    } catch (err: any) {
      setError({
        email: "",
        password: "",
        fallBackError: err?.message || "An unexpected error occurred",
      });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      className="bg-white flex-1"
      keyboardShouldPersistTaps="handled"
    >
      <View className="px-6 py-12">
        <View className="items-center my-5">
          <Image
            source={require("../../assets/images/ingrej-blue-logo.png")}
            style={{ width: 150, height: 50 }}
            contentFit="contain"
          />
        </View>
        <Text className="text-2xl font-bold text-center">Sign In</Text>
        <Text className="text-gray-500 mt-2 text-center">
          Sign in to your account to continue
        </Text>

        <View className="mt-10">
          <View>
            <Text className="text-gray-500 mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={loginData.email}
              onChangeText={(value) => handleInputChange("email", value)}
            />
            {error.email ? (
              <Text className="text-red-500 mb-2">{error.email}</Text>
            ) : null}
          </View>

          <View>
            <Text className="text-gray-500 mb-2">Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="Enter your password"
              secureTextEntry
              value={loginData.password}
              onChangeText={(value) => handleInputChange("password", value)}
            />
            {error.password ? (
              <Text className="text-red-500 mb-2">{error.password}</Text>
            ) : null}
          </View>

          {error.fallBackError ? (
            <Text className="text-red-500 mb-2">{error.fallBackError}</Text>
          ) : null}

          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 mt-3"
            onPress={handleSignIn}
          >
            <Text className="text-white text-center font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>

          <View className="flex-row mt-2 gap-1 items-center">
            <Text className="text-gray-600">Don&apos;t have an account?</Text>
            <Link href="/sign-up" className="text-blue-600 font-semibold">
              Sign Up
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
