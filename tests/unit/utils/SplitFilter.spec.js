import SplitFilter from "@/utils/SplitFilter";

describe("SplitFilter.js", () => {
  it("Split first part", () => {
    let result = SplitFilter("W20 (O)", "(", 0);
    expect(result).toEqual("W20");
  });

  it("Split over index", () => {
    let result = SplitFilter("W20 (O)", "(", 2);
    expect(result).toEqual("");
  });
});
