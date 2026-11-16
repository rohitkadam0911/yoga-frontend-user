import axios from "axios";

const defaultBaseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
    baseURL: defaultBaseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptor to attach Authorization header & dynamically adjust LAN IP if needed
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (window.location.hostname) {
            const hostname = window.location.hostname;
            const isPrivateLanIp = /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname);

            if (isPrivateLanIp) {
                try {
                    const currentBase = config.baseURL || defaultBaseURL;
                    const url = new URL(currentBase, window.location.origin);
                    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
                        url.hostname = hostname;
                        config.baseURL = url.toString().replace(/\/$/, "");
                    }
                } catch (e) {
                    // Ignore parse errors and keep config.baseURL
                }
            }
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== "undefined" && localStorage.getItem("token")) {
                localStorage.removeItem("token");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
