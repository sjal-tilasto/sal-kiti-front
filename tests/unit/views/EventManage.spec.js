import { shallowMount, createLocalVue } from "@vue/test-utils";
import EventManage from "@/views/EventManage.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("EventManage.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(EventManage, {
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
