import mockAxios from "axios";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import CompetitionList from "@/components/CompetitionList.vue";

import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);
const state = { user: { is_authenticated: false } };
const store = new Vuex.Store({ state });

describe("CompetitionList.vue", () => {
  afterEach(() => {
    mockAxios.get.mockClear();
  });

  it("renders competition list", async () => {
    const $route = {
      params: { event_id: 1 }
    };

    const wrapper = mount(CompetitionList, {
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
      params: { event_id: 99 }
    };
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          status: 500,
          statusText: "Server error"
        }
      })
    );

    const wrapper = shallowMount(CompetitionList, {
      localVue,
      store,
      mocks: {
        $route
      }
    });
    await flushPromises();
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain("import.error.server");
  });

  it("triggers event router on click", async () => {
    const $router = {
      push: jest.fn()
    };
    const $route = {
      params: { event_id: 1 }
    };

    const wrapper = mount(CompetitionList, {
      localVue,
      store,
      mocks: {
        $route,
        $router
      }
    });
    await flushPromises();
    const event = wrapper.findAll("tr").at(1);
    await event.trigger("click");
    expect($router.push).toHaveBeenCalledWith({
      name: "competition",
      params: { competition_id: 1 }
    });
  });
});
