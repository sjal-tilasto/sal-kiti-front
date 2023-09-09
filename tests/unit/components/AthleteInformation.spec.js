import { createLocalVue, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import AthleteInformation from "@/components/AthleteInformation.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
const state = { editMode: false, user: { is_staff: false } };
const store = new Vuex.Store({ state });

describe("AthleteInformation.vue", () => {
  it("renders athlete information", async () => {
    const $route = {
      params: { athlete_id: 1 }
    };
    const wrapper = shallowMount(AthleteInformation, {
      localVue,
      store,
      mocks: {
        $route
      }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("render error message on error", async () => {
    const $route = {
      params: { athlete_id: 99 }
    };
    const wrapper = shallowMount(AthleteInformation, {
      localVue,
      store,
      mocks: {
        $route
      }
    });
    await flushPromises();
    expect(wrapper.text()).toContain("import.error.unknown");
  });
});
