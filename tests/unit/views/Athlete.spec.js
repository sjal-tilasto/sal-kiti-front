import { shallowMount, createLocalVue } from "@vue/test-utils";
import Athlete from "@/views/Athlete.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("Athlete.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(Athlete, {
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
