import { shallowMount, createLocalVue } from "@vue/test-utils";
import AthleteImport from "@/views/AthleteImport.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("AthleteImport.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(AthleteImport, {
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
