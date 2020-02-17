import { shallowMount, createLocalVue } from "@vue/test-utils";
import Event from "@/views/Event.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("Event.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(Event, {
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
