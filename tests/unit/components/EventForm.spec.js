import { createLocalVue, shallowMount } from "@vue/test-utils";
import EventForm from "@/components/EventForm.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const $router = {
  push: jest.fn()
};

const formData = {
  name: "Demo Champion",
  date_start: "2019-01-22",
  date_end: "2019-01-24",
  location: "Village Field",
  organization: 1
};

describe("EventForm.vue", () => {
  it("renders event form with even information", async () => {
    const $route = {
      params: { query: { event_id: 1 } }
    };
    const wrapper = shallowMount(EventForm, {
      localVue,
      mocks: {
        $route,
        $router
      }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("posts new event", async () => {
    const $route = {
      params: { query: {} }
    };
    const wrapper = shallowMount(EventForm, {
      localVue,
      mocks: {
        $route,
        $router
      }
    });
    wrapper.setData({
      event: formData
    });
    await wrapper.vm.postEvent();
    expect($router.push).toHaveBeenCalledWith({
      name: "event",
      params: { event_id: 5 }
    });
  });

  it("updates event data", async () => {
    const $route = {
      params: { query: { event_id: 1 } }
    };
    const wrapper = shallowMount(EventForm, {
      localVue,
      mocks: {
        $route,
        $router
      }
    });
    wrapper.vm.$data.event.name = "Village Champs";
    await wrapper.vm.putEvent(1);
    expect($router.push).toHaveBeenCalledWith({
      name: "event",
      params: { event_id: 1 }
    });
  });
});
