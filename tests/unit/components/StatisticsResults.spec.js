import mockAxios from "axios";
import {
  createLocalVue,
  mount,
  RouterLinkStub,
  shallowMount
} from "@vue/test-utils";
import flushPromises from "flush-promises";
import StatisticsResults from "@/components/StatisticsResults.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

describe("StatisticsResults.vue", () => {
  it("renders result list", async () => {
    const wrapper = mount(StatisticsResults, {
      localVue,
      stubs: { "router-link": RouterLinkStub },
      propsData: {
        searchParameters:
          "?fields!=partial&category=1&level=2&type=1,2&organization=1&start=20190608&end=20190713&limit=10"
      }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("render error message on error", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          status: 404,
          statusText: "Not Found"
        }
      })
    );
    const wrapper = shallowMount(StatisticsResults, {
      localVue,
      propsData: {
        searchParameters: "?fields!=partial&limit=10"
      }
    });
    await flushPromises();
    expect(wrapper.text()).toContain("import.error.notfound");
  });
});
