import { shallowMount, createLocalVue } from "@vue/test-utils";
import Statistics from "@/views/Statistics.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("Statistics.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(Statistics, {
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
