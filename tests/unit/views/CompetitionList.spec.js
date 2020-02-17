import { shallowMount, createLocalVue } from "@vue/test-utils";
import CompetitionList from "@/views/CompetitionList.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("CompetitionList.vue", () => {
  const $route = {
    params: { id: 1 }
  };
  it("renders content", () => {
    const wrapper = shallowMount(CompetitionList, {
      localVue,
      mocks: {
        $route
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
