import axios from "axios";
import { INVALID_TOKEN_MESSAGES } from "../utils/constants";
import { BASE_URL } from "./endpoints";


const instance = axios.create({
    baseURL: BASE_URL,
});
// handle header or other stuff later 
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);



// handle response of all api which are intercepted by this instance
instance.interceptors.response.use(
    (res) => res,
    async (err) => {
        // navigate user to login page if token is expire or no token
        // if (err?.response?.data?.message && INVALID_TOKEN_MESSAGES.includes(err?.response?.data?.message)) {
        //     localStorage.clear()
        //     window.location.href = '/'
        // }
        // console.log(err.response.data.message)
        return Promise.reject(err);
    },
);



export default instance;