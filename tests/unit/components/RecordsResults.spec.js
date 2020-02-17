import { createLocalVue, RouterLinkStub, mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import RecordsResults from "@/components/RecordsResults.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

describe("RecordsResults.vue", () => {
  let state = {};
  let store = new Vuex.Store({ state });

  it("renders result list", async () => {
    const wrapper = mount(RecordsResults, {
      localVue,
      store,
      stubs: { "router-link": RouterLinkStub },
      propsData: {
        searchParameters:
          "?sport=1&level=1&category=1,2&type=1,2&approved=1&historical=0"
      }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("renders result list with management options", async () => {
    state = {
      editMode: true,
      user: { is_authenticated: true, is_staff: true }
    };
    store = new Vuex.Store({ state });
    const wrapper = mount(RecordsResults, {
      localVue,
      store,
      stubs: { "router-link": RouterLinkStub },
      propsData: {
        searchParameters:
          "?sport=1&level=1&category=1,2&type=1,2&approved=1&historical=0"
      }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });
});
