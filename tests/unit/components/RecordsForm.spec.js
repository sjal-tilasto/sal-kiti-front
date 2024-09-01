import { createLocalVue, shallowMount } from "@vue/test-utils";
import RecordsForm from "@/components/RecordsForm.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const state = { user: { is_staff: false } };
const store = new Vuex.Store({ state });

const $route = {
  query: { sport: 1 }
};

const $router = {
  push: jest.fn()
};

describe("RecordsForm.vue", () => {
  it("renders records search form", async () => {
    const wrapper = shallowMount(RecordsForm, {
      localVue,
      store,
      mocks: {
        $route,
        $router
      }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });
  it("search records", async () => {
    const event = { preventDefault: jest.fn() };

    const wrapper = shallowMount(RecordsForm, {
      localVue,
      store,
      mocks: {
        $route,
        $router
      }
    });
    wrapper.vm.$data.form = {
      category: ["1", "2"],
      competitionType: ["1", "2"],
      division: [],
      approved: true,
      preliminary: false,
      historical: false
    };
    await flushPromises();
    wrapper.vm.onSubmit(event);
    expect(wrapper.vm.$data.searchParameters).toBe(
      "?sport=1&level=1&category=1,2&type=1,2&approved=1&historical=0"
    );
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });
});
