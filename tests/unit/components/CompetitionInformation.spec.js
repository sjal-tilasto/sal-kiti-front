import { createLocalVue, RouterLinkStub, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import CompetitionInformation from "@/components/CompetitionInformation.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

let state = { user: { is_authenticated: false } };
let store = new Vuex.Store({ state });

describe("CompetitionInformation.vue", () => {
  it("renders Competition information", async () => {
    const $route = {
      params: { competition_id: 1 }
    };
    const wrapper = shallowMount(CompetitionInformation, {
      localVue,
      store,
      mocks: {
        $route
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("show management options for staff", async () => {
    state = {
      editMode: true,
      user: { is_authenticated: true, is_staff: true, is_superuser: true }
    };
    store = new Vuex.Store({ state });
    const $route = {
      params: { competition_id: 1 }
    };
    const wrapper = shallowMount(CompetitionInformation, {
      localVue,
      store,
      mocks: {
        $route
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("show management options for organization user", async () => {
    state = { editMode: true, user: { is_authenticated: true } };
    store = new Vuex.Store({ state });
    const $route = {
      params: { competition_id: 1 }
    };
    const wrapper = shallowMount(CompetitionInformation, {
      localVue,
      store,
      mocks: {
        $route
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    wrapper.vm.$data.competition.permissions = { update: true };
    expect(wrapper.element).toMatchSnapshot();
  });

  it("swap visibility", async () => {
    state = { user: { is_authenticated: true } };
    store = new Vuex.Store({ state });
    const $route = {
      params: { competition_id: 1 }
    };
    const wrapper = shallowMount(CompetitionInformation, {
      localVue,
      store,
      mocks: {
        $route
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    expect(wrapper.vm.$data.competition.public).toBe(false);
    await wrapper.vm.togglePublicStatus();
    expect(wrapper.vm.$data.competition.public).toBe(true);
  });

  it("swap lock", async () => {
    state = { user: { is_authenticated: true } };
    store = new Vuex.Store({ state });
    const $route = {
      params: { competition_id: 1 }
    };
    const wrapper = shallowMount(CompetitionInformation, {
      localVue,
      store,
      mocks: {
        $route
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    expect(wrapper.vm.$data.competition.locked).toBe(false);
    await wrapper.vm.toggleLockStatus();
    expect(wrapper.vm.$data.competition.locked).toBe(true);
  });

  it("render error message on error", async () => {
    const $route = {
      params: { competition_id: 99 }
    };
    const wrapper = shallowMount(CompetitionInformation, {
      localVue,
      store,
      mocks: {
        $route
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    expect(wrapper.text()).toContain("import.error.unknown");
  });
});
