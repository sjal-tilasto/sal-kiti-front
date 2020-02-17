import { shallowMount, createLocalVue } from "@vue/test-utils";
import InfoSport from "@/views/InfoSport.vue";

import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

let state = { user: { is_authenticated: false } };
let store = new Vuex.Store({ state });

describe("InfoSport.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(InfoSport, {
      localVue,
      store
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
