import { createLocalVue, shallowMount } from "@vue/test-utils";
import CompetitionSearch from "@/components/CompetitionSearch.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

let state = { user: { is_staff: false } };

let store = new Vuex.Store({ state });

const formData = {
  competitionLevel: [2],
  competitionType: [1, 2],
  date_start: "2019-06-08",
  date_end: "2019-07-13",
  future: true
};

const $route = {
  query: { sport: 1 }
};

const $router = {
  push: jest.fn()
};

describe("CompetitionSearch.vue", () => {
  it("renders competition search form", async () => {
    const wrapper = shallowMount(CompetitionSearch, {
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

  it("submit creates search query", () => {
    store = new Vuex.Store({ state });
    const event = { preventDefault: jest.fn() };

    const wrapper = shallowMount(CompetitionSearch, {
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
    expect(wrapper.vm.$data.searchParams).toBe(
      "?limit=25&sport=1&level=2&type=1,2&start=2019-06-08&end=2019-07-13"
    );
  });
});
