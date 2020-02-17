import { shallowMount, createLocalVue } from "@vue/test-utils";
import AthleteSearch from "@/views/AthleteSearch.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("AthleteSearch.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(AthleteSearch, {
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
