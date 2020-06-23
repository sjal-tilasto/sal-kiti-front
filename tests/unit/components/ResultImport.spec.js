import {
  createLocalVue,
  shallowMount,
  mount,
  RouterLinkStub
} from "@vue/test-utils";
import ResultImport from "@/components/ResultImport.vue";
import BootstrapVue from "bootstrap-vue";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $route = {
  params: { competition_id: 1 }
};

const resultTests = [
  {
    category: "SC",
    first_name: "Master",
    last_name: "Archer",
    organization: "LC",
    "kneel-1": 50,
    position: 1,
    position_pre: 2,
    result: 200,
    sport_id: 3456789
  },
  {
    category: "SC",
    organization: "LC",
    result: 200,
    result_code: "DNF",
    sport_id: 3456789
  },
  {
    category: "SC",
    organization: "LC",
    result_code: "DNF",
    sport_id: 3456789
  },
  {
    category: "SC",
    organization: "LC",
    result_code: "Incorrect",
    sport_id: 3456789
  },
  {
    category: "SC",
    first_name: "Incorrect",
    last_name: "Incorrect",
    organization: "Village",
    result: 200,
    sport_id: 3456789
  },
  {
    category: "Village",
    organization: "LC",
    result: 200,
    sport_id: 1234567
  },
  {
    category: "Village",
    organization: "LC",
    position: "two",
    result: 200,
    sport_id: 1234567
  },
  {
    category: "Incorrect",
    organization: "Incorrect",
    result: 200,
    sport_id: 1234567
  },
  {
    category: "Incorrect",
    organization: "LC",
    result: 200,
    sport_id: 3456789
  },
  {
    category: "SC",
    organization: "LC",
    result: 200,
    sport_id: 3456789
  },
  {
    category: "SC",
    organization: "LC",
    "kneel-1": 150,
    result: 200,
    sport_id: 3456789
  },
  {
    category: "SC",
    organization: "LC",
    "incorrect-1": 50,
    result: 200,
    sport_id: 3456789
  },
  {
    first_name: "Master",
    last_name: "Archer",
    organization: "Incorrect",
    result: 500
  },
  {
    category: "SC",
    organization: "LC",
    position: 1,
    position_pre: 2,
    result: 200,
    sport_id: 3456789
  },
  {
    category: "SC",
    organization: "LC",
    "kneel-1": 50,
    result: 200,
    sport_id: 3456789
  },
  {
    category: "TeamC",
    organization: "LC",
    position_pre: 2,
    result: 200,
    sport_id: 3456789,
    team_name: "Team Failure 1"
  },
  {
    category: "TeamC",
    organization: "LC",
    result: 200,
    team_members: "1234567,3456789",
    team_name: "Team Success 1"
  },
  {
    category: "TeamC",
    organization: "LC",
    result: 190,
    sport_id_a: "1234567",
    sport_id_b: "3456789",
    first_name_b: "Ignored",
    last_name_b: "Archer",
    organization_b: "EXT",
    team_name: "Team Success 2"
  },
  {
    category: "TeamC",
    organization: "LC",
    result: 180,
    sport_id_a: "1234567",
    first_name_b: "External",
    last_name_b: "Archer",
    organization_b: "EXT",
    team_name: "Team Success 3"
  }
];

describe("ResultImport.vue", () => {
  it("renders result import form", async () => {
    const wrapper = shallowMount(ResultImport, {
      localVue,
      mocks: {
        $route
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("parses results", async () => {
    const wrapper = mount(ResultImport, {
      localVue,
      mocks: {
        $route
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    wrapper.vm.$data.results = resultTests;
    wrapper.vm.parseResults();
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });
});
