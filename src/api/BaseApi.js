import axios from "axios";
import i18n from "../i18n";
import store from "../store";

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

HTTP.interceptors.request.use(function (config) {
  config.headers["Accept-Language"] = i18n.locale;
  return config;
});

HTTP.interceptors.response.use(
  function (response) {
    const versionHeader = "spa-version";
    if (
      versionHeader in response.headers &&
      parseInt(response.headers[versionHeader])
    ) {
      let apiVersion = parseInt(response.headers[versionHeader]);
      let currentVersion = store.state.spaVersion;
      if (currentVersion) {
        if (currentVersion < apiVersion) {
          store.commit("setSPAVersion", apiVersion);
          window.location.reload(true);
        }
      } else {
        store.commit("setSPAVersion", apiVersion);
      }
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
