import axios from "axios";

const client = axios.create({
  baseURL: "http://192.168.1.6:3000",
  responseType: "json",
  withCredentials: true,
});

export default client;
