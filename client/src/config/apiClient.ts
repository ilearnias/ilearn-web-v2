import axios from "axios";
import { API } from "./api";


const apiClient = axios.create({
  baseURL: API.BASEURL, // your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});


export default apiClient;
