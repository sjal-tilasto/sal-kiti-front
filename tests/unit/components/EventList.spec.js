import mockAxios from "axios";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import EventList from "@/components/EventList.vue";

import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);
const state = { user: { is_authenticated: false } };
const store = new Vuex.Store({ state });

describe("EventList.vue", () => {
  afterEach(() => {
    mockAxios.get.mockClear();
  });

  it("renders event list", async () => {
    const wrapper = mount(EventList, {
      store,
      localVue
    });
    await flushPromises();
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(wrapper.element).toMatchSnapshot();
  });

  it("render error message on error", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          status: 500,
          statusText: "Server error"
        }
      })
    );
    const wrapper = shallowMount(EventList, {
      store,
      localVue
    });
    await flushPromises();
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain("import.error.server");
  });

  it("triggers event router on click", async () => {
    const $router = {
      push: jest.fn()
    };
    const wrapper = mount(EventList, {
      localVue,
      store,
      mocks: {
        $router
      }
    });
    await flushPromises();
    const event = wrapper.findAll("tr").at(1);
    await event.trigger("click");
    expect($router.push).toHaveBeenCalledWith({
      name: "event",
      params: { event_id: 2 }
    });
  });
});
