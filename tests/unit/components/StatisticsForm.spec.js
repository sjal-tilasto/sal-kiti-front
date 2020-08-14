import { createLocalVue, shallowMount } from "@vue/test-utils";
import StatisticsForm from "@/components/StatisticsForm.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

let state = { user: { is_staff: false } };

let store = new Vuex.Store({ state });

const formData = {
  approved: false,
  category: [1],
  competitionLevel: [2],
  competitionType: [1, 2],
  organization: [1],
  date_start: "2019-06-08",
  date_end: "2019-07-13",
  max_results: 25,
  external: false,
  group_results: "---",
  trial: false
};

const $route = {
  query: { sport: 1 }
};

const $router = {
  push: jest.fn()
};

describe("StatisticsForm.vue", () => {
  it("renders statistics search form", async () => {
    const wrapper = shallowMount(StatisticsForm, {
      localVue,
      store,
      mocks: {
        $route,
        $router
      }
    });
    wrapper.setData({
      showExtraFields: true
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("submit creates search query", () => {
    store = new Vuex.Store({ state });
    const event = { preventDefault: jest.fn() };

    const wrapper = shallowMount(StatisticsForm, {
      localVue,
      store,
      mocks: {
        $route,
        $router
      }
    });
    wrapper.setData({
      form: formData
    });
    wrapper.vm.onSubmit(event);
    expect(wrapper.vm.$data.searchParameters).toBe(
      "?fields!=partial&sport=1&category=1&level=2&type=1,2&organization=1&start=2019-06-08&end=2019-07-13&limit=25"
    );
  });

  it("reset empties search query and form data", () => {
    state = { user: { is_staff: false } };
    const mutations = {
      setSearchUrl: jest.fn()
    };

    store = new Vuex.Store({ state, mutations });
    const event = { preventDefault: jest.fn() };

    const wrapper = shallowMount(StatisticsForm, {
      localVue,
      store,
      mocks: {
        $route,
        $router
      }
    });
    wrapper.setData({
      form: formData
    });
    wrapper.vm.onReset(event);
    expect(wrapper.vm.form).toEqual({
      approved: false,
      category: [],
      competitionLevel: [],
      competitionType: [],
      date_end: null,
      organization: [],
      max_results: 25,
      date_start: null,
      external: false,
      group_results: "---",
      trial: false
    });
  });
});
