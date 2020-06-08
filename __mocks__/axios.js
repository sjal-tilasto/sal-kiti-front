const competitions = {
  results: [
    {
      id: 1,
      date_start: "2019-02-23",
      date_end: "2019-02-23",
      type_info: {
        name: "10m Competition",
        abbreviation: "10MC",
        sport: 1
      },
      type: 1,
      level_info: {
        name: "European Championships",
        abbreviation: "EC"
      },
      public: false,
      locked: false,
      event: 1,
      event_info: {
        name: "EventName"
      },
      name: "Demo Competition",
      description: "EC on the Village Field",
      competition: 1
    },
    {
      id: 2,
      date_start: "2019-02-24",
      date_end: "2019-02-24",
      type_info: {
        name: "50m Competition",
        abbreviation: "50MC",
        sport: 1
      },
      type: 1,
      level_info: {
        name: "National Championships",
        abbreviation: "NC"
      },
      public: true,
      locked: true,
      event: 1,
      event_info: {
        name: "EventName"
      },
      competition: 1
    }
  ]
};

const events = {
  results: [
    {
      id: 1,
      name: "Demo Champion",
      description: "Demo competition on the Village Field",
      date_start: "2019-01-22",
      date_end: "2019-01-24",
      location: "Village Field",
      organization: 1,
      organization_info: {
        abbreviation: "LC",
        name: "Local Club"
      },
      competitions: [
        {
          id: 1,
          type: "10m Competition",
          public: true
        },
        {
          id: 2,
          type: "50m Competition",
          public: false
        }
      ],
      public: false,
      locked: false
    },
    {
      id: 2,
      name: "Demo Competition",
      date_start: "2019-01-25",
      date_end: "2019-01-25",
      location: "Village",
      organization: 2,
      organization_info: {
        abbreviation: "Village",
        name: "Village Athletes"
      },
      public: true,
      locked: true
    }
  ]
};

const athletes = {
  results: [
    {
      id: 1,
      first_name: "Master",
      last_name: "Archer",
      sport_id: 3456789,
      organization: 1,
      additional_organizations: [2],
      organization_info: {
        abbreviation: "LC",
        name: "Local Club"
      }
    },
    {
      id: 2,
      first_name: "Apprentice",
      last_name: "Athlete",
      sport_id: 1234567,
      organization: 2,
      additional_organizations: [],
      organization_info: {
        abbreviation: "Village",
        name: "Village Athletes"
      }
    }
  ]
};

const results = {
  count: 2,
  limit: 10,
  num_page: 1,
  page: 1,
  results: [
    {
      id: 1,
      athlete: 1,
      competition: 1,
      organization: "Club",
      category: "N",
      result: "200.6",
      decimals: 1,
      position: 1,
      approved: false,
      partial: [
        {
          decimals: 1,
          order: 1,
          time: null,
          type: {
            abbreviation: "fin",
            name: "Final"
          },
          value: "49.20"
        }
      ]
    },
    {
      id: 2,
      athlete: 2,
      competition: 1,
      organization: "ABC",
      category: "N",
      result: "206.4",
      decimals: 1,
      position: 2,
      approved: false
    }
  ]
};

const resultlist = {
  count: 2,
  limit: 10,
  num_page: 1,
  page: 1,
  results: [
    {
      id: 81,
      athlete: {
        id: 83,
        first_name: "Sara",
        last_name: "Huff",
        sport_id: 6340457,
        organization: 2
      },
      competition: {
        id: "1",
        name: "Demo Comp",
        date_start: "2019-01-23",
        date_end: "2019-01-23",
        type: 1,
        type_info: {
          name: "50m Competition",
          abbreviation: "50MC"
        },
        level: 1,
        level_info: {
          name: "National Championships",
          abbreviation: "NC"
        }
      },
      first_name: "Sara",
      last_name: "Huff",
      organization: "Club",
      category: "N",
      result: "200.6",
      decimals: 1,
      position: 1,
      pre_position: 2,
      partial: [
        {
          decimals: 1,
          order: 1,
          time: null,
          type: {
            abbreviation: "fin",
            name: "Final"
          },
          value: "49.20"
        },
        {
          decimals: 1,
          order: 1,
          time: null,
          type: {
            abbreviation: "fsum",
            name: "Final sum"
          },
          value: "442.20"
        },
        {
          decimals: 0,
          order: 1,
          time: null,
          type: {
            abbreviation: "kneel",
            name: "Kneeling"
          },
          value: "99.00"
        },
        {
          decimals: 0,
          order: 1,
          time: null,
          type: {
            abbreviation: "ksum",
            name: "Kneeling sum"
          },
          value: "381.00"
        },
        {
          decimals: 0,
          id: 403,
          order: 1,
          time: null,
          type: {
            abbreviation: "prone",
            name: "Prone"
          },
          value: "91.00"
        },
        {
          decimals: 0,
          id: 407,
          order: 1,
          time: null,
          type: {
            abbreviation: "psum",
            name: "Prone sum"
          },
          value: "369.00"
        }
      ],
      approved: false
    },
    {
      id: 110,
      athlete: {
        id: 112,
        first_name: "Phyllis",
        last_name: "Miller",
        sport_id: 6340454,
        organization: 1
      },
      competition: {
        id: "1",
        name: "Demo Comp",
        date_start: "2019-01-23",
        date_end: "2019-01-23",
        type: 1,
        type_info: {
          name: "50m Competition",
          abbreviation: "50MC"
        },
        level: 1,
        level_info: {
          name: "National Championships",
          abbreviation: "NC"
        }
      },
      first_name: "Phyllis",
      last_name: "Miller",
      organization: "ABC",
      category: "N",
      result: "206.4",
      decimals: 1,
      position: 2,
      pre_position: 1,
      partial: [
        {
          decimals: 1,
          order: 1,
          time: null,
          type: {
            abbreviation: "fin",
            name: "Final"
          },
          value: "48.90"
        },
        {
          decimals: 1,
          order: 1,
          time: null,
          type: {
            abbreviation: "fsum",
            name: "Final sum"
          },
          value: "436.10"
        },
        {
          decimals: 0,
          order: 1,
          time: null,
          type: {
            abbreviation: "kneel",
            name: "Kneeling"
          },
          value: "91.00"
        },
        {
          decimals: 0,
          order: 1,
          time: null,
          type: {
            abbreviation: "ksum",
            name: "Kneeling sum"
          },
          value: "350.00"
        },
        {
          decimals: 0,
          id: 403,
          order: 1,
          time: null,
          type: {
            abbreviation: "prone",
            name: "Prone"
          },
          value: "90.00"
        },
        {
          decimals: 0,
          id: 407,
          order: 1,
          time: null,
          type: {
            abbreviation: "psum",
            name: "Prone sum"
          },
          value: "367.00"
        }
      ],
      approved: false
    },
    {
      id: 87,
      athlete: {
        id: 89,
        first_name: "Jessica",
        last_name: "Carlson",
        sport_id: 6340458,
        organization: 1
      },
      competition: {
        id: "1",
        name: "Demo Comp",
        date_start: "2019-01-23",
        date_end: "2019-01-23",
        type: 1,
        type_info: {
          name: "50m Competition",
          abbreviation: "50MC"
        },
        level: 1,
        level_info: {
          name: "National Championships",
          abbreviation: "NC"
        }
      },
      first_name: "Jessica",
      last_name: "Carlson",
      organization: "ABC",
      category: "M",
      elimination_category: "M",
      result: "222.0",
      result_code: "DNF",
      decimals: 0,
      position: 3,
      pre_position: 3,
      approved: false,
      partial: [
        {
          decimals: 0,
          order: 1,
          time: null,
          type: {
            abbreviation: "ksum",
            name: "Kneeling sum"
          },
          value: "301.00"
        },
        {
          decimals: 0,
          id: 407,
          order: 1,
          time: null,
          type: {
            abbreviation: "psum",
            name: "Prone sum"
          },
          value: "321.00"
        }
      ]
    }
  ]
};

const competitionresulttypes = {
  results: [
    {
      id: 1,
      competition_type: 1,
      name: "Final",
      abbreviation: "fin",
      max_result: 10,
      min_result: 0
    },
    {
      id: 2,
      competition_type: 1,
      name: "Final sum",
      abbreviation: "fsum",
      max_result: 0,
      min_result: 50
    },
    {
      id: 3,
      competition_type: 1,
      name: "Kneeling",
      abbreviation: "kneel",
      max_result: 100,
      min_result: 0
    },
    {
      id: 4,
      competition_type: 1,
      name: "Kneeling sum",
      abbreviation: "ksum",
      max_result: 400,
      min_result: 0
    },
    {
      id: 5,
      competition_type: 1,
      name: "Prone",
      abbreviation: "prone",
      max_result: 100,
      min_result: 0
    },
    {
      id: 6,
      competition_type: 1,
      name: "Prone sum",
      abbreviation: "psum",
      max_result: 400,
      min_result: 0
    },
    {
      id: 7,
      competition_type: 1,
      name: "X",
      abbreviation: "x",
      max_result: 40,
      min_result: 0
    }
  ]
};

const competitionlayouts = {
  results: [
    {
      id: 1,
      block: 0,
      col: 2,
      competition_type: 1,
      hide: "",
      label: "final",
      name: "fin",
      order: 1,
      row: 0,
      show: ""
    },
    {
      id: 2,
      block: 0,
      col: 0,
      competition_type: 1,
      hide: "",
      label: "preliminary",
      name: "nolimit",
      order: 1,
      row: 1,
      show: ""
    },
    {
      id: 3,
      block: 1,
      col: 1,
      competition_type: 1,
      hide: "",
      label: "#",
      name: "position",
      order: null,
      row: 1,
      show: ""
    },
    {
      id: 4,
      block: 1,
      col: 2,
      competition_type: 1,
      hide: "",
      label: "Athlete",
      name: "athlete",
      order: null,
      row: 1,
      show: ""
    },
    {
      id: 5,
      block: 1,
      col: 3,
      competition_type: 1,
      hide: "",
      label: "Club",
      name: "organization",
      order: null,
      row: 1,
      show: ""
    },
    {
      id: 6,
      block: 1,
      col: 4,
      competition_type: 1,
      hide: "md",
      label: "F1",
      name: "fin-1",
      order: 6,
      row: 1,
      show: ""
    },
    {
      id: 7,
      block: 1,
      col: 11,
      competition_type: 1,
      hide: "",
      label: "Result",
      name: "fsum-1",
      order: 7,
      row: 1,
      show: ""
    },
    {
      id: 8,
      block: 2,
      col: 1,
      competition_type: 1,
      hide: "",
      label: "#",
      name: "position",
      order: null,
      row: 1,
      show: ""
    },
    {
      id: 9,
      block: 2,
      col: 2,
      competition_type: 1,
      hide: "",
      label: "Athlete",
      name: "athlete",
      order: null,
      row: 1,
      show: ""
    },
    {
      id: 10,
      block: 2,
      col: 3,
      competition_type: 1,
      hide: "",
      label: "Club",
      name: "organization",
      order: null,
      row: 1,
      show: ""
    },
    {
      id: 11,
      block: 2,
      col: 4,
      competition_type: 1,
      hide: "md",
      label: "Position",
      name: "pos",
      order: 1,
      row: 1,
      show: ""
    },
    {
      id: 12,
      block: 2,
      col: 5,
      competition_type: 1,
      hide: "lg",
      label: "S1",
      name: "kneel-1",
      order: 2,
      row: 1,
      show: ""
    },
    {
      id: 13,
      block: 2,
      col: 6,
      competition_type: 1,
      hide: "md",
      label: "Sum",
      name: "ksum-1",
      order: 3,
      row: 1,
      show: ""
    },
    {
      id: 14,
      block: 2,
      col: 7,
      competition_type: 1,
      hide: "",
      label: "Result",
      name: "result",
      order: 17,
      row: 1,
      show: ""
    },
    {
      id: 15,
      block: 2,
      col: 8,
      competition_type: 1,
      hide: "sm",
      label: "Info",
      name: "info",
      order: null,
      row: 1,
      show: ""
    },
    {
      id: 16,
      block: 2,
      col: 9,
      competition_type: 1,
      hide: "",
      label: "Details",
      name: "detail",
      order: null,
      row: 1,
      show: ""
    },
    {
      id: 17,
      block: 2,
      col: 5,
      competition_type: 1,
      hide: "lg",
      label: "S1",
      name: "prone-1",
      order: 4,
      row: 2,
      show: ""
    },
    {
      id: 18,
      block: 2,
      col: 6,
      competition_type: 1,
      hide: "md",
      label: "Sum",
      name: "psum-1",
      order: 5,
      row: 2,
      show: ""
    }
  ]
};

const categories = {
  results: [
    {
      id: 1,
      name: "Sport Category",
      abbreviation: "SC",
      team: false
    },
    {
      id: 2,
      name: "Team Category",
      abbreviation: "TeamC",
      team: true
    }
  ]
};

const competitionlevels = {
  results: [
    {
      id: 1,
      name: "Village Championships",
      abbreviation: "VC"
    }
  ]
};

const competitiontypes = {
  results: [
    {
      id: 1,
      name: "Paintball",
      abbreviation: "PB",
      number_of_rounds: 0,
      max_result: 600,
      min_result: null,
      sport: 1
    }
  ]
};

const organizations = {
  results: [
    {
      id: 1,
      name: "Local Club",
      abbreviation: "LC"
    },
    {
      id: 2,
      name: "Village Athletes",
      abbreviation: "Village"
    }
  ]
};

const recordlevels = {
  results: [
    {
      id: 1,
      name: "Village Champion",
      abbreviation: "VC"
    }
  ]
};

const recordlist = {
  results: [
    {
      id: 1,
      result: {
        first_name: "Master",
        last_name: "Archer",
        competition: {
          name: "Agnetanpolku",
          type_info: {
            name: "Paintball",
            abbreviation: "PB",
            sport: 1
          }
        },
        organization: "LC",
        result: "623.9",
        decimals: 1
      },
      level: "VC",
      type: "Paintball",
      category: "SC",
      approved: true,
      date_start: "2019-01-01",
      date_end: null
    }
  ]
};

const pohjolanmalja = {
  results: [
    {
      organization: {
        id: 1,
        name: "Local Club",
        abbreviation: "LC"
      },
      value: 8
    },
    {
      organization: {
        id: 2,
        name: "Village Club",
        abbreviation: "VC"
      },
      value: 2
    }
  ]
};

const sports = {
  results: [
    {
      id: 1,
      name: "Paintball",
      abbreviation: "PB"
    }
  ]
};

const error_message = {
  status: 404,
  response: "Not Found"
};

const mock = jest.fn(
  url =>
    new Promise((resolve, reject) => {
      let data = null;
      let data_id = null;
      if (url.startsWith("events/")) {
        data = events;
      } else if (url.startsWith("competitions/")) {
        data = competitions;
      } else if (url.startsWith("athletes/")) {
        data = athletes;
      } else if (url.startsWith("results/")) {
        data = results;
      } else if (url.startsWith("competitionlayouts/")) {
        data = competitionlayouts;
      } else if (url.startsWith("categories/")) {
        data = categories;
      } else if (url.startsWith("competitionlevels/")) {
        data = competitionlevels;
      } else if (url.startsWith("competitiontypes/")) {
        data = competitiontypes;
      } else if (url.startsWith("competitionresulttypes")) {
        data = competitionresulttypes;
      } else if (url.startsWith("organizations/")) {
        data = organizations;
      } else if (url.startsWith("recordlist/")) {
        data = recordlist;
      } else if (url.startsWith("recordlevels")) {
        data = recordlevels;
      } else if (url.startsWith("resultlist")) {
        if (url.includes("athlete=") || url.includes("competition=")) {
          data = resultlist.results;
        } else {
          data = resultlist;
        }
      } else if (url.startsWith("sports/")) {
        data = sports;
      } else if (url.startsWith("sal/pohjolanmalja/")) {
        data = pohjolanmalja;
      } else {
        data = {};
        reject(error_message);
      }
      const splitted = url.split("/", 2);
      data_id = parseInt(splitted[1]);
      let temp_data = null;
      if (data_id) {
        if (data_id == 99) {
          reject(error_message);
        }
        temp_data = data.results.filter(obj => obj.id === data_id)[0];
      }
      if (url.includes("=99")) {
        reject(error_message);
      }
      if (data) {
        const params = url.split("?")[1];
        if (
          params &&
          splitted[0] !== "recordlist" &&
          splitted[0] !== "resultlist"
        ) {
          params.split("&").forEach(function(part) {
            let param = part.split("=");
            if (param[0] in data.results[0] && param[1].search(",") === -1) {
              if (temp_data) {
                temp_data.results = temp_data.results.filter(
                  obj => obj[param[0]] == param[1]
                );
              } else {
                temp_data = { results: [] };
                temp_data.results = data.results.filter(
                  obj => obj[param[0]] == param[1]
                );
              }
            }
          });
        }
        if (temp_data !== null) {
          resolve({
            data: temp_data
          });
        } else {
          resolve({
            data: data
          });
        }
      } else {
        reject(error_message);
      }
    })
);

const mock_modify = jest.fn(
  (url, data) =>
    new Promise((resolve, reject) => {
      const splitted = url.split("/", 2);
      let data_id = parseInt(splitted[1]);
      if (data) {
        if (data_id) {
          data["id"] = data_id;
        } else {
          data["id"] = 5;
        }
        resolve({
          data: data
        });
      } else {
        reject(error_message);
      }
    })
);

const axios = {
  get: mock,
  patch: mock_modify,
  put: mock_modify,
  post: mock_modify,
  create: jest.fn(function() {
    return this;
  }),
  interceptors: {
    request: {
      use: jest.fn()
    }
  }
};

export default axios;
