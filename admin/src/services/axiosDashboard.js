import axios from "axios";
import { getTokenStorage } from "../utils/storage";

const axiosDashboard = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_DASHBOARD_URL,
  headers: {
    Accept: "Content-Type",
    "Content-Type": "application/json",
    Authorization: `Bearer ${getTokenStorage()}`,
  },
  validateStatus: function (status) {
    // console.log("🆘 VALIDATION STATUS", status);
    return status === 200 || status === 422;
  },
});

axiosDashboard.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("🚀 axiosDashboard.js:22 ~ error:", error);

    if (error.response) {
      const apiError = error.response.data;
      return Promise.reject(apiError);
    }
    return Promise.reject(error);
  }
);

export default axiosDashboard;
