import { shallowMount, createLocalVue } from "@vue/test-utils";
import CompetitionSearch from "@/views/CompetitionSearch.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("CompetitionSearch.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(CompetitionSearch, {
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
