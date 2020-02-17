import {
  createLocalVue,
  RouterLinkStub,
  shallowMount,
  mount
} from "@vue/test-utils";
import flushPromises from "flush-promises";
import AthleteResults from "@/components/AthleteResults.vue";
import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("AthleteResults.vue", () => {
  it("renders result list", async () => {
    const $route = {
      params: { athlete_id: 1 }
    };
    const wrapper = mount(AthleteResults, {
      localVue,
      mocks: {
        $route
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("render error message on error", async () => {
    const $route = {
      params: { athlete_id: 99 }
    };
    const wrapper = shallowMount(AthleteResults, {
      localVue,
      mocks: {
        $route
      }
    });
    await flushPromises();
    expect(wrapper.text()).toContain("import.error.unknown");
  });
});
