/**
 * Parses Ianseo ASC CSV data to results objects
 *
 * @param {array} data
 * @returns {array} list of results objects
 */

export default function(data) {
  let results = [];
  let headers = {
    sport_id: 1,
    division: 2,
    category: 3,
    name: 4,
    organization: 5,
    result: 7,
    xs: 8,
    tens: 9,
    position: 14,
    part1: 16,
    part2: 19,
    part3: 22,
    part4: 25
  };
  let elimHeaders = {
    sport_id: 1,
    division: 2,
    category: 3,
    elimination_category: 6,
    round: 7,
    position: 9
  };
  let divisions = new Map();
  divisions.set("C", "T");
  divisions.set("B", "V");
  divisions.set("BB", "V");
  divisions.set("R", "");
  let categories = new Map();
  categories.set("J5", "15");
  categories.set("J7", "17");
  categories.set("T5", "T15");
  categories.set("T7", "T17");
  categories.set("J5T", "15T");
  categories.set("J7T", "17T");
  categories.set("T5T", "T15T");
  categories.set("T7T", "T17T");
  categories.set("J5V", "15V");
  categories.set("J7V", "17V");
  categories.set("T5V", "T15V");
  categories.set("T7V", "T17V");
  categories.set("N2", "N20");
  categories.set("N2V", "N20V");
  categories.set("N2T", "N20T");
  categories.set("J15", "15");
  categories.set("J15V", "15V");
  categories.set("J15T", "15T");
  categories.set("J17", "17");
  categories.set("J17V", "17V");
  categories.set("J17T", "17T");
  categories.set("Y20", "20");
  categories.set("Y20V", "20V");
  categories.set("Y20T", "20T");
  categories.set("Y50", "50");
  categories.set("Y50V", "50V");
  categories.set("Y50T", "50T");
  categories.set("N5", "N50");
  categories.set("N5V", "N50V");
  categories.set("N5T", "N50T");
  categories.set("Y60", "60");
  categories.set("Y60V", "60V");
  categories.set("Y60T", "60T");
  categories.set("N6", "N60");
  categories.set("N6V", "N60V");
  categories.set("N6T", "N60T");
  categories.set("Y70", "70");
  categories.set("Y70V", "70V");
  categories.set("Y70T", "70T");
  categories.set("N7", "N70");
  categories.set("N7V", "N70V");
  categories.set("N7T", "N70T");
  /* Header row is usally around 7th line */
  for (const row in data) {
    if (data[row][0] === "1") {
      let result = {};
      result.partial = [];
      result.sport_id = data[row][headers.sport_id];
      let division = data[row][headers.division];
      if (divisions.has(division)) {
        division = divisions.get(division);
      }
      let category = data[row][headers.category];
      if (categories.has(category)) {
        category = categories.get(category);
      }
      result.category = category.concat(division);
      let names = data[row][headers.name].split(" ");
      result.last_name = names[0];
      if (names.length > 1) {
        result.first_name = names[1];
      } else {
        result.first_name = "";
      }
      result.organization = data[row][headers.organization];
      if (data[row][headers.result] && parseInt(data[row][headers.result])) {
        result.result = parseInt(data[row][headers.result]);
      }
      if (
        data[row][headers.position] &&
        parseInt(data[row][headers.position])
      ) {
        result.position_pre = parseInt(data[row][headers.position]);
      }
      if (data[row][headers.xs] && parseInt(data[row][headers.xs])) {
        result["xt-1"] = parseInt(data[row][headers.xs]);
      }
      if (data[row][headers.tens] && parseInt(data[row][headers.tens])) {
        result["tens-1"] = parseInt(data[row][headers.tens]);
      }
      if (data[row][headers.part1] && parseInt(data[row][headers.part1])) {
        result["part-1"] = parseInt(data[row][headers.part1]);
      }
      if (data[row][headers.part2] && parseInt(data[row][headers.part2])) {
        result["part-2"] = parseInt(data[row][headers.part2]);
      }
      if (data[row][headers.part3] && parseInt(data[row][headers.part3])) {
        result["part-3"] = parseInt(data[row][headers.part3]);
      }
      if (data[row][headers.part4] && parseInt(data[row][headers.part4])) {
        result["part-4"] = parseInt(data[row][headers.part4]);
      }
      results.push(result);
    } else if (data[row][0] === "2") {
      let sport_id = data[row][elimHeaders.sport_id];
      let division = data[row][elimHeaders.division];
      if (divisions.has(division)) {
        division = divisions.get(division);
      }
      let category = data[row][elimHeaders.category];
      if (categories.has(category)) {
        category = categories.get(category);
      }
      category = category.concat(division);
      let index = results.findIndex(
        res => res.sport_id === sport_id && res.category === category
      );
      if (index >= 0) {
        let elimination_category = data[row][elimHeaders.elimination_category];
        if (divisions.get(elimination_category.charAt(0)) !== undefined) {
          let division = divisions.get(elimination_category.charAt(0));
          elimination_category = elimination_category
            .substr(1)
            .concat(division);
        }
        if (categories.has(elimination_category)) {
          elimination_category = categories.get(elimination_category);
        }
        results[index].elimination_category = elimination_category;
        let position = parseInt(data[row][elimHeaders.position]);
        if (position) {
          results[index].position = position;
        } else {
          results[index].position = results[index].position_pre;
        }
        if (position) {
          let round = data[row][elimHeaders.round].split("|")[1];
          if (round >= 2 && position <= 4) {
            if (parseInt(data[row].slice(-1)[0].split("|")[0]) !== undefined) {
              results[index]["elim-1"] = parseInt(
                data[row].slice(-1)[0].split("|")[0]
              );
            }
            if (parseInt(data[row].slice(-2)[0].split("|")[0]) !== undefined) {
              results[index]["elim-2"] = parseInt(
                data[row].slice(-2)[0].split("|")[0]
              );
            }
          }
          if (round >= 4 && position <= 8) {
            if (parseInt(data[row].slice(-3)[0].split("|")[0]) !== undefined) {
              results[index]["elim-3"] = parseInt(
                data[row].slice(-3)[0].split("|")[0]
              );
            }
          }
          if (round >= 8 && position <= 16) {
            if (parseInt(data[row].slice(-4)[0].split("|")[0]) !== undefined) {
              results[index]["elim-4"] = parseInt(
                data[row].slice(-4)[0].split("|")[0]
              );
            }
          }
          if (round >= 16 && position <= 32) {
            if (parseInt(data[row].slice(-5)[0].split("|")[0]) !== undefined) {
              results[index]["elim-5"] = parseInt(
                data[row].slice(-5)[0].split("|")[0]
              );
            }
          }
          if (round >= 24 && position <= 48) {
            if (parseInt(data[row].slice(-6)[0].split("|")[0]) !== undefined) {
              results[index]["elim-6"] = parseInt(
                data[row].slice(-6)[0].split("|")[0]
              );
            }
          }
          if (round >= 48 && position <= 104) {
            if (parseInt(data[row].slice(-7)[0].split("|")[0]) !== undefined) {
              results[index]["elim-7"] = parseInt(
                data[row].slice(-7)[0].split("|")[0]
              );
            }
          }
        }
      }
    }
  }
  return results;
}
