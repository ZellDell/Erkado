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
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

function LoginScreen() {
  const navigation = useNavigation();

  const [username, setUsername] = useState("farm1");
  const [password, setPassword] = useState("123");

  const [error, setError] = useState();

  const { onLogin, onRegister } = useAuth();

  const login = async () => {
    const result = await onLogin(username, password);
    console.log(result);
    if (result) {
      alert("Login Success!");
    }
    if (result && result.error) {
      alert(result.msg);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView style={styles.AndroidSafeArea} className="bg-white pt-5">
      <Text>Login</Text>
      <Button onPress={login} title="Login Press"></Button>

      <Text>{error}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default LoginScreen;
