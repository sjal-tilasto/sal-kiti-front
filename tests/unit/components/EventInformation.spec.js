import { createLocalVue, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import EventInformation from "@/components/EventInformation.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

let state = { user: { is_authenticated: false } };
let store = new Vuex.Store({ state });

describe("EventInformation.vue", () => {
  it("renders event information", async () => {
    const $route = {
      params: { event_id: 1 }
    };
    const wrapper = shallowMount(EventInformation, {
      localVue,
      store,
      mocks: {
        $route
      }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("show management options for staff", async () => {
    state = {
      editMode: true,
      user: { is_authenticated: true, is_staff: true }
    };
    store = new Vuex.Store({ state });
    const $route = {
      params: { event_id: 1 }
    };
    const wrapper = shallowMount(EventInformation, {
      localVue,
      store,
      mocks: {
        $route
      }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("show management options for organization user", async () => {
    state = { editMode: true, user: { is_authenticated: true } };
    store = new Vuex.Store({ state });
    const $route = {
      params: { event_id: 1 }
    };
    const wrapper = shallowMount(EventInformation, {
      localVue,
      store,
      mocks: {
        $route
      }
    });
    await flushPromises();
    wrapper.vm.$data.event.permissions = { update: true };
    expect(wrapper.element).toMatchSnapshot();
  });

  it("swap visibility", async () => {
    state = { user: { is_authenticated: true } };
    store = new Vuex.Store({ state });
    const $route = {
      params: { event_id: 1 }
    };
    const wrapper = shallowMount(EventInformation, {
      localVue,
      store,
      mocks: {
        $route
      }
    });
    await flushPromises();
    expect(wrapper.vm.$data.event.public).toBe(false);
    await wrapper.vm.togglePublicStatus();
    expect(wrapper.vm.$data.event.public).toBe(true);
  });

  it("swap lock", async () => {
    state = { user: { is_authenticated: true } };
    store = new Vuex.Store({ state });
    const $route = {
      params: { event_id: 1 }
    };
    const wrapper = shallowMount(EventInformation, {
      localVue,
      store,
      mocks: {
        $route
      }
    });
    await flushPromises();
    expect(wrapper.vm.$data.event.locked).toBe(false);
    await wrapper.vm.toggleLockStatus();
    expect(wrapper.vm.$data.event.locked).toBe(true);
  });

  it("render error message on error", async () => {
    const $route = {
      params: { event_id: 99 }
    };
    const wrapper = shallowMount(EventInformation, {
      localVue,
      mocks: {
        $route
      },
      store
    });
    await flushPromises();
    expect(wrapper.text()).toContain("import.error.unknown");
  });
});
