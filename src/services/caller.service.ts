import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an Axios instance with base configuration
const Axios = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Include cookies in requests
    headers: {
        "Content-Type": "application/json",
    },
});

export default Axios;
