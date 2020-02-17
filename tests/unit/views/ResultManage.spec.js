import { shallowMount, createLocalVue } from "@vue/test-utils";
import ResultManage from "@/views/ResultManage.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("ResultManage.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(ResultManage, {
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
