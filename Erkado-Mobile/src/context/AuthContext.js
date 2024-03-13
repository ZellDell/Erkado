import { createContext, useContext, useEffect, useState } from "react";
import { axios } from "axios";
import * as SecureStore from "expo-secure-store";

import client from "../api/client";

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
      const result = await client.post(`/user/login`, {
        username,
        password,
      });

      setAuthState({
        token: result.data.token,
        authenticated: true,
      });

      console.log(result.data);

      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

      return result;
    } catch (error) {
      return { error: true, msg: error.response.data.msg || error };
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
      const result = await client.get(`/user/`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
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
