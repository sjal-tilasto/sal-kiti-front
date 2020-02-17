import GroupArrayByKey from "@/utils/GroupArrayByKey";

const result_data = [
  {
    id: 1,
    category: "W"
  },
  {
    id: 2,
    category: "M"
  },
  {
    id: 3,
    category: "W"
  },
  {
    id: 4,
    category: "M"
  }
];

const partial_data = [
  {
    id: 1,
    category: "M",
    partial: [
      {
        type: { id: 2, name: "Finals", abbreviation: "elim" },
        order: 1
      }
    ]
  },
  {
    id: 2,
    category: "M",
    partial: [
      {
        type: { id: 2, name: "Finals", abbreviation: "elim" },
        order: 1
      },
      {
        type: { id: 2, name: "Finals", abbreviation: "elim" },
        order: 2
      }
    ]
  },
  {
    id: 3,
    category: "W",
    partial: [
      {
        type: { id: 2, name: "Finals", abbreviation: "elim" },
        order: 1
      },
      {
        type: { id: 2, name: "Finals", abbreviation: "elim" },
        order: 2
      },
      {
        type: { id: 2, name: "Finals", abbreviation: "elim" },
        order: 3
      }
    ]
  }
];

describe("GroupArrayByKey.js", () => {
  it("orders results by category", () => {
    let result = GroupArrayByKey(result_data, "category", "elim");
    expect(Object.keys(result)).toEqual(["W", "M"]);
    expect(result["M"]).toHaveLength(2);
    expect(result["M"][0].category).toEqual("M");
    expect(result["M"][1].category).toEqual("M");
    expect(Object.keys(result["M"][1])).toEqual(["id", "category"]);
  });

  it("max_rounds is calculated", () => {
    let result = GroupArrayByKey(partial_data, "category", "elim");
    expect(result["M"][0].max_rounds).toEqual(2);
    expect(result["W"][0].max_rounds).toEqual(3);
  });
});
