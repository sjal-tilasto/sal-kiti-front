import { shallowMount, createLocalVue } from "@vue/test-utils";
import Home from "@/views/Home.vue";

import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

let state = { user: { is_authenticated: false } };
let store = new Vuex.Store({ state });

describe("Home.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(Home, {
      localVue,
      store,
      computed: {
        year() {
          return 2021;
        }
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
