import { shallowMount, createLocalVue } from "@vue/test-utils";
import TheNavbar from "@/components/TheNavbar.vue";

import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

describe("TheNavbar.vue", () => {
  const state = { user: { is_authenticated: false } };
  const store = new Vuex.Store({ state });
  it("contains menus", () => {
    const wrapper = shallowMount(TheNavbar, {
      localVue,
      store,
      mocks: {
        $i18n: {
          locale: ["en", "fi"]
        }
      }
    });
    expect(wrapper.text()).toContain("nav.title");
  });
});
