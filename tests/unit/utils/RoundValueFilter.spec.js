import RoundValueFilter from "@/utils/RoundValueFilter";

describe("RoundValueFilter.js", () => {
  it("rounds float to correct decimals", () => {
    let result = RoundValueFilter("22.34", 1);
    expect(result).toEqual("22,3");
  });

  it("rounds float to correctly up", () => {
    let result = RoundValueFilter("22.35", 1);
    expect(result).toEqual("22,4");
  });

  it("returns empty with incorrect value", () => {
    let result = RoundValueFilter("abc", 1);
    expect(result).toEqual("");
  });

  it("returns empty with incorrect decimals", () => {
    let result = RoundValueFilter("22.11", "a");
    expect(result).toEqual("22,11");
  });
});
