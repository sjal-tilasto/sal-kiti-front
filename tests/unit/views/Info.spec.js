import { shallowMount, createLocalVue } from "@vue/test-utils";
import Info from "@/views/Info.vue";

import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

let state = { user: { is_authenticated: false } };
let store = new Vuex.Store({ state });

describe("Info.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(Info, {
      localVue,
      store
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
