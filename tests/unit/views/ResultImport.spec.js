import { shallowMount, createLocalVue } from "@vue/test-utils";
import ResultImport from "@/views/ResultImport.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("ResultImport.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(ResultImport, {
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
