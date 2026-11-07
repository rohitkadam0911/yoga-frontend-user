import axios from "axios";

const defaultBaseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
    baseURL: defaultBaseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptor to ensure LAN / mobile access dynamically uses current host if baseURL is pointing to localhost
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined" && window.location.hostname) {
        const hostname = window.location.hostname;
        if (hostname !== "localhost" && hostname !== "127.0.0.1") {
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
    return config;
});

export default api;
