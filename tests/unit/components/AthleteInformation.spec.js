import { createLocalVue, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import AthleteInformation from "@/components/AthleteInformation.vue";
import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("AthleteInformation.vue", () => {
  it("renders athlete information", async () => {
    const $route = {
      params: { athlete_id: 1 }
    };
    const wrapper = shallowMount(AthleteInformation, {
      localVue,
      mocks: {
        $route
      }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("render error message on error", async () => {
    const $route = {
      params: { athlete_id: 99 }
    };
    const wrapper = shallowMount(AthleteInformation, {
      localVue,
      mocks: {
        $route
      }
    });
    await flushPromises();
    expect(wrapper.text()).toContain("import.error.unknown");
  });
});
