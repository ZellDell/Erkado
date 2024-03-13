import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  UserIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
} from "react-native-heroicons/outline";
import { useAuth, onGetUser } from "../context/AuthContext";

function HomeScreen() {
  const navigation = useNavigation();

  const { onLogout, onGetUser } = useAuth();
  const [userInfo, setUserInfo] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { Email, UserType, Username, UserId } = await onGetUser();
      setUserInfo({ Email, UserType, Username, UserId });
      alert("Username: " + Username);
    };
    fetchUserInfo();
  }, []);

  const fetchUser = async () => {
    const { Email, UserType, Username, UserId } = await onGetUser();
    setUserInfo({ Email, UserType, Username, UserId });
  };

  return (
    <SafeAreaView style={styles.AndroidSafeArea} className="bg-white pt-5">
      {/* Header */}

      <View className="flex-row pb-3 items-center mx-4 space-x-2">
        <Image
          source={require("../../assets/Erkado-logo.png")}
          className="h-9 w-9 rounded-full"
        />

        <View className="flex-1">
          <Text className="font-bold text-gray-400 text-xs">
            {userInfo.UserType || ""}
          </Text>
          <Text className="font-bold text-xl">
            {userInfo.Username || ""}
            <ChevronDownIcon size={20} color="#00CCBB" />
          </Text>
        </View>
        <UserIcon size={35} color="#00CCBB" />
      </View>

      {/* Search */}
      <View className="flex-row items-center space-x-2 pb-2 mx-4 px-2">
        <View className="flex-row flex-1 space-x-2 bg-gray-200 p-3">
          <MagnifyingGlassIcon color="gray" size={25} />
          <TextInput
            placeholder="Restaurant and Cuisines"
            keyboardType="default"
          />
        </View>
        <AdjustmentsVerticalIcon color="#00CCBB" />
      </View>

      {/* Body */}
      <ScrollView></ScrollView>

      <Button onPress={onLogout} title="Logout"></Button>
      <View className="mt-8">
        <Button onPress={fetchUser} title="fetch"></Button>
      </View>
      <View className="mt-8">
        <Text>{userInfo.Email || ""}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default HomeScreen;
