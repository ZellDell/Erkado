import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

import client, { setHeader } from "../api/client";

const TOKEN_KEY = "Erkado-User-Token";
const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    authenticated: false,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      if (token) {
        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);

  const register = async (email, password) => {
    try {
      return await axios.post(`${API_URL}/user`, { email, password });
    } catch (e) {
      return { error: true, msg: e.response.data.message };
    }
  };

  const login = async (username, password) => {
    try {
      const { data } = await client.post(`/user/login`, {
        username,
        password,
      });

      setAuthState({
        token: data.token,
        authenticated: true,
      });

      const accessToken = data.token;

      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);

      setHeader(accessToken);

      return data;
    } catch (error) {
      const { response } = error;
      if (response?.data) {
        return response.data;
      }
      return { error: "***" + error.message || error };
    }
  };

  const logout = async () => {
    try {
      console.log("loggin Out");
      await SecureStore.deleteItemAsync(TOKEN_KEY);

      setAuthState({
        token: null,
        authenticated: false,
      });
      console.log("Logout Sucessfully");
    } catch (e) {
      return { error: true, msg: e.response.data.message };
    }
  };

  const getUser = async () => {
    try {
      const result = await client.get(`/user/`);
      console.log("User Info: ", result.data.userInfo);
      return result.data.userInfo;
    } catch (e) {
      if (e.response.data.message === "jwt expired") {
        alert("Session Expired");
        await logout();
      }
      return { error: true, err: e.response };
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onGetUser: getUser,
    authState,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
