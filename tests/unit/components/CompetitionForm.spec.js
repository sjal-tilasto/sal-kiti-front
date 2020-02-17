import { createLocalVue, shallowMount } from "@vue/test-utils";
import CompetitionForm from "@/components/CompetitionForm.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const state = { user: { is_staff: false }, searchUrl: "" };
const mutations = {
  setSearchUrl: jest.fn()
};
const store = new Vuex.Store({ state, mutations });

const $router = {
  push: jest.fn()
};

describe("CompetitionForm.vue", () => {
  it("renders competition form", async () => {
    const $route = {
      params: { query: { event_id: 1, competition_id: 1 } }
    };
    const wrapper = shallowMount(CompetitionForm, {
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

  it("updates competition data", async () => {
    const $route = {
      params: { query: { event_id: 1, competition_id: 1 } }
    };
    const wrapper = shallowMount(CompetitionForm, {
      localVue,
      mocks: {
        $route,
        $router
      }
    });
    wrapper.vm.$data.form.name = "Village Champs";
    await wrapper.vm.putCompetition(1);
    expect($router.push).toHaveBeenCalledWith({
      name: "competition",
      params: { competition_id: 1 }
    });
  });
});
