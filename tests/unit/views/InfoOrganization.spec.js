import { shallowMount, createLocalVue } from "@vue/test-utils";
import InfoOrganization from "@/views/InfoOrganization.vue";

import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

let state = { user: { is_authenticated: false } };
let store = new Vuex.Store({ state });

describe("InfoOrganization.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(InfoOrganization, {
      localVue,
      store
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
