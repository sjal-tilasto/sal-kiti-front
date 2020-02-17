import { shallowMount, createLocalVue } from "@vue/test-utils";
import StatisticsPohjolanMalja from "@/views/StatisticsPohjolanMalja.vue";

import BootstrapVue from "bootstrap-vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("StatisticsPohjolanMalja.vue", () => {
  it("renders content", () => {
    const wrapper = shallowMount(StatisticsPohjolanMalja, {
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
