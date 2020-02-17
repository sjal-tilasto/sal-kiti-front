import { shallowMount, createLocalVue } from "@vue/test-utils";
import Competition from "@/views/Competition.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("Competition.vue", () => {
  const $route = {
    params: { id: 1 }
  };
  it("renders content", () => {
    const wrapper = shallowMount(Competition, {
      localVue,
      mocks: {
        $route
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
