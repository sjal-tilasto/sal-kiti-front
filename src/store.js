import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { HTTP } from "./api/BaseApi.js";

export default new Vuex.Store({
  state: {
    csrfToken: "",
    user: {
      is_authenticated: false,
      is_staff: false
    },
    editMode: false
  },
  mutations: {
    setCSRFToken(state, token) {
      state.csrfToken = token;
    },
    setUserInfo(state, info) {
      state.user = info;
    },
    toggleEditMode(state) {
      state.editMode = !state.editMode;
    }
  },
  getters: {
    csrfToken: state => state.csrfToken
  },
  actions: {
    userInfo({ commit }) {
      HTTP.get("users/current/")
        .then(response => {
          commit("setUserInfo", response.data);
        })
        .catch(error => {
          commit("setUserInfo", {
            is_authenticated: false,
            is_staff: false,
            error: error.response
          });
        });
    }
  }
});
