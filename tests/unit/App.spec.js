import { shallowMount, createLocalVue } from "@vue/test-utils";
import App from "@/App.vue";
import VueRouter from "vue-router";

import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(VueRouter);
localVue.use(Vuex);

describe("App.vue", () => {
  let actions = {
    userInfo: jest.fn()
  };
  const store = new Vuex.Store({ actions });
  it("renders content", () => {
    const wrapper = shallowMount(App, {
      localVue,
      store
    });
    expect(wrapper.element).toMatchSnapshot();
    expect(actions.userInfo).toHaveBeenCalled();
  });
});
