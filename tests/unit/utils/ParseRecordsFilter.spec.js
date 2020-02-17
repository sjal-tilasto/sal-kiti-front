import ParseRecordsFilter from "@/utils/ParseRecordsFilter";

describe("ParseRecordsFilter.js", () => {
  const data = [
    { level: "SE", approved: true, category: "W20", date_end: null },
    { level: "SE", approved: false, category: "W", date_end: null },
    { level: "WR", approved: true, category: "W16", date_end: "2018-01-01" }
  ];

  it("lists all records", () => {
    let result = ParseRecordsFilter(data, true);
    expect(result).toEqual("SE W20, (SE W)");
  });

  it("lists approved records", () => {
    let result = ParseRecordsFilter(data, false);
    expect(result).toEqual("SE W20");
  });

  it("does not list categories", () => {
    let result = ParseRecordsFilter(data, true, true);
    expect(result).toEqual("SE");
  });

  it("returns empty if data not given", () => {
    let result = ParseRecordsFilter();
    expect(result).toEqual("");
  });
});
