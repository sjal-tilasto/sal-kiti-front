import { shallowMount, createLocalVue } from "@vue/test-utils";
import CompetitionManage from "@/views/CompetitionManage.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("CompetitionManage.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(CompetitionManage, {
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
