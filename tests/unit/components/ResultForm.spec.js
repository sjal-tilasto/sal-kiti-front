import { createLocalVue, shallowMount } from "@vue/test-utils";
import ResultForm from "@/components/ResultForm.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import flushPromises from "flush-promises";
import mockAxios from "axios";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const $router = {
  push: jest.fn()
};

const partialResult = {
  decimals: 1,
  order: 1,
  time: null,
  type: 2,
  value: "49.2"
};

const state = {
  user: { is_superuser: true }
};
const store = new Vuex.Store({ state });

describe("ResultForm.vue", () => {
  it("renders result form", async () => {
    const $route = {
      params: { result_id: 1 }
    };
    const wrapper = shallowMount(ResultForm, {
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

  it("updates result data", async () => {
    const $route = {
      params: { result_id: 1 }
    };
    const wrapper = shallowMount(ResultForm, {
      localVue,
      store,
      mocks: {
        $route,
        $router
      }
    });
    await flushPromises();
    await wrapper.vm.putResult(1);
    expect($router.push).toHaveBeenCalledWith({
      name: "competition",
      params: { competition_id: 1 }
    });
  });

  it("adds partial result", async () => {
    const $route = {
      params: { result_id: 1 }
    };
    const wrapper = shallowMount(ResultForm, {
      localVue,
      store,
      mocks: {
        $route,
        $router
      }
    });
    wrapper.vm.postPartial(partialResult);
    expect(mockAxios.post).toHaveBeenCalledWith(
      "partialresults/",
      { decimals: 1, id: 5, order: 1, time: null, type: 2, value: "49.2" },
      { headers: { "X-CSRFToken": null } }
    );
  });
});
