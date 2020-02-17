import { shallowMount, createLocalVue } from "@vue/test-utils";
import Records from "@/views/Records.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("Records.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(Records, {
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
