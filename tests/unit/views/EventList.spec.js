import { shallowMount, createLocalVue } from "@vue/test-utils";
import EventList from "@/views/EventList.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("EventList.vue", () => {
  const $route = {
    params: { id: 1 }
  };
  it("renders content", () => {
    const wrapper = shallowMount(EventList, {
      localVue,
      mocks: {
        $route
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
