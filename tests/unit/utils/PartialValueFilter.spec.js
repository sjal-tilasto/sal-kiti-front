import PartialValueFilter from "@/utils/PartialValueFilter";

describe("PartialValueFilter.js", () => {
  const data = [
    {
      type: { id: 2, name: "Finals", abbreviation: "elim" },
      order: 1,
      value: "32.2",
      decimals: 1
    },
    {
      type: { id: 2, name: "Finals", abbreviation: "elim" },
      order: 2,
      value: "15.2",
      decimals: 0
    }
  ];

  it("rounds value correctly", () => {
    let result = PartialValueFilter(data, "elim", 1);
    expect(result).toEqual("32,2");
    let result2 = PartialValueFilter(data, "elim", 2);
    expect(result2).toEqual("15");
  });

  it("returns empty if order not found", () => {
    let result = PartialValueFilter(data, "elim", 3);
    expect(result).toEqual("");
  });

  it("returns empty if type not found", () => {
    let result = PartialValueFilter(data, "test", 1);
    expect(result).toEqual("");
  });

  it("returns empty if incorrect data given", () => {
    let result = PartialValueFilter([{ a: 1 }], "elim", 1);
    expect(result).toEqual("");
  });

  it("returns empty if data not given", () => {
    let result = PartialValueFilter();
    expect(result).toEqual("");
  });
});
