import axios from "axios";
import i18n from "../i18n";

/**
 * Creates an Axios instance for API calls
 * - sets Accept-Language header for every request
 *
 * @type {AxiosInstance}
 */
export const HTTP = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  withCredentials: true
});

HTTP.interceptors.request.use(function(config) {
  config.headers["Accept-Language"] = i18n.locale;
  return config;
});
