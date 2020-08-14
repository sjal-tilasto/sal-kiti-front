import mockAxios from "axios";
import { createLocalVue, shallowMount, mount } from "@vue/test-utils";
import SearchPage from "@/components/AthleteSearch.vue";
import BootstrapVue from "bootstrap-vue";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const $router = {
  push: jest.fn()
};

describe("AthleteSearch.vue", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders search form", () => {
    const $route = {
      query: {}
    };

    const wrapper = shallowMount(SearchPage, {
      localVue,
      mocks: {
        $route
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it("parses query parameter", () => {
    const $route = {
      query: {
        search: "athlete"
      }
    };
    const wrapper = shallowMount(SearchPage, {
      localVue,
      mocks: {
        $route
      }
    });
    expect(wrapper.vm.form.search).toBe("athlete");
  });

  it("search triggers api call ", async () => {
    const event = { preventDefault: jest.fn() };
    const $route = {
      query: {
        search: "athlete"
      }
    };

    const wrapper = mount(SearchPage, {
      localVue,
      mocks: {
        $route,
        $router
      }
    });
    const input = wrapper.find("input");
    input.element.value = "athlete";
    wrapper.vm.onSubmit(event);
    expect(mockAxios.get).toHaveBeenCalledWith(
      "athletes/?search=athlete&limit=10&page=1"
    );
    await flushPromises();
    expect(wrapper.vm.results.results[0].last_name).toBe("Archer");
  });

  it("render error message on error", async () => {
    mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        response: {
          status: 404,
          statusText: "Not Found"
        }
      })
    );
    const $route = {
      query: {
        search: "Athlete",
        load: true
      }
    };
    const wrapper = shallowMount(SearchPage, {
      localVue,
      mocks: {
        $route,
        $router
      }
    });
    await flushPromises();
    expect(wrapper.text()).toContain("import.error.notfound");
  });
});
