import { createLocalVue, mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import StatisticsPohjolanMalja from "@/components/StatisticsPohjolanMalja.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

describe("StatisticsPohjolanMalja.vue", () => {
  it("renders result list", async () => {
    const wrapper = mount(StatisticsPohjolanMalja, {
      localVue
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });
});
