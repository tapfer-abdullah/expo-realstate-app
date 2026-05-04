import { useAuth, useSignUp } from "@clerk/expo";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SingUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field} with value: ${value}`);
    setLoginData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setError((prevError) => ({
      ...prevError,
      [field]: "",
    }));
  };

  const validateInputs = () => {
    let valid = true;

    if (!loginData.name) {
      setError((prevError) => ({
        ...prevError,
        name: "Name is required",
      }));
      valid = false;
    }

    if (!loginData.email) {
      setError((prevError) => ({
        ...prevError,
        email: "Email is required",
      }));
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      setError((prevError) => ({
        ...prevError,
        email: "Please enter a valid email address",
      }));
      valid = false;
    }

    if (!loginData.password) {
      setError((prevError) => ({
        ...prevError,
        password: "Password is required",
      }));
      valid = false;
    }

    if (!loginData.confirmPassword) {
      setError((prevError) => ({
        ...prevError,
        confirmPassword: "Please confirm your password",
      }));
      valid = false;
    } else if (loginData.password !== loginData.confirmPassword) {
      setError((prevError) => ({
        ...prevError,
        confirmPassword: "Passwords do not match",
      }));
      valid = false;
    }

    return valid;
  };

  const handleSingUp = async () => {
    setIsLoading(true);
    if (!validateInputs()) {
      setIsLoading(false);
      return;
    }

    const response = await signUp.password({
      firstName: loginData.name?.split(" ")[0] || "",
      lastName: loginData.name?.split(" ")[1] || "",
      emailAddress: loginData.email,
      password: loginData.password,
    });

    const { error } = response;
    console.log("Sign Up response:", response);
    setIsLoading(false);

    if (error) {
      alert(`Sign Up failed: ${error.message}`);
      console.error(JSON.stringify(error, null, 2));
      setIsLoading(false);

      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });
    if (signUp.status === "complete") {
      await signUp.finalize({
        // Redirect the user to the home page after signing up
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as any);
          }
        },
      });
    } else {
      // Check why the sign-up is not complete
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View className="px-6 py-12">
        <Text className=" text-2xl font-bold text-center">
          Verify Your Email
        </Text>
        <Text className=" text-gray-500 mt-2 text-center">
          We emailed you a code to verify your email address. Enter the code
          below to complete your sign-up.
        </Text>

        <TextInput
          className=" border border-gray-300 rounded-lg px-4 py-3 mb-4 mt-6"
          placeholder="Enter verification code"
          value={code}
          onChangeText={(value) => setCode(value)}
        />
        <TouchableOpacity
          className=" bg-blue-600 rounded-lg py-3 mt-3"
          onPress={() => {
            handleVerify();
          }}
        >
          <Text className=" text-white text-center font-semibold">
            Verify Email
          </Text>
        </TouchableOpacity>

        {/* request new verification code */}
        <TouchableOpacity
          className=" mt-4"
          onPress={() => {
            signUp.verifications.sendEmailCode();
          }}
        >
          <Text className=" text-blue-600 text-center font-semibold">
            Resend Verification Code
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
      }}
      className="bg-white flex-1"
      keyboardShouldPersistTaps="handled"
    >
      <View className="px-6 py-12">
        <Image
          source={require("../../assets/images/ingrej-blue-logo.png")}
          className=" h-20 min-w-[80px] w-auto mb-10"
          contentFit="contain"
        />
        <Text className=" text-2xl font-bold text-center">Sign Up</Text>
        <Text className=" text-gray-500 mt-2 text-center">
          Sign Up to your account to continue
        </Text>

        {/* Form */}
        <View className=" mt-10">
          {/* Name Input */}
          <View>
            <Text className=" text-gray-500 mb-2">Name</Text>
            <TextInput
              className=" border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="Enter your name"
              value={loginData.name}
              onChangeText={(value) => handleInputChange("name", value)}
            />
            {error.name && (
              <Text className=" text-red-500 mb-2">{error.name}</Text>
            )}
          </View>

          {/* Email Input */}
          <View>
            <Text className=" text-gray-500 mb-2">Email</Text>
            <TextInput
              className=" border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={loginData.email}
              onChangeText={(value) => handleInputChange("email", value)}
            />
            {error.email && (
              <Text className=" text-red-500 mb-2">{error.email}</Text>
            )}
          </View>
          {/* Password Input */}
          <View>
            <Text className=" text-gray-500 mb-2">Password</Text>
            <TextInput
              className=" border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="Enter your password"
              secureTextEntry
              value={loginData.password}
              onChangeText={(value) => handleInputChange("password", value)}
            />
            {error.password && (
              <Text className=" text-red-500 mb-2">{error.password}</Text>
            )}
          </View>
          {/* Confirm Password Input */}
          <View>
            <Text className=" text-gray-500 mb-2">Confirm Password</Text>
            <TextInput
              className=" border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="Confirm your password"
              secureTextEntry
              value={loginData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
            />
            {error.confirmPassword && (
              <Text className=" text-red-500 mb-2">
                {error.confirmPassword}
              </Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className=" bg-blue-600 rounded-lg py-3 mt-3"
            onPress={() => {
              handleSingUp();
            }}
          >
            <Text className=" text-white text-center font-semibold">
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          {/* sign up link */}
          <View className="flex-row mt-2 gap-1 items-center">
            <Text className="text-gray-600">Already have an account?</Text>
            <Link href="/sign-in" className=" text-blue-600 font-semibold">
              Sign In
            </Link>
          </View>

          {/* Errors */}
          {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
          {errors && (
            <Text className=" text-red-500 mt-4">
              {JSON.stringify(errors, null, 2)}
            </Text>
          )}

          {/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
          <View nativeID="clerk-captcha" />
        </View>
      </View>
    </ScrollView>
  );
};

export default SingUp;
