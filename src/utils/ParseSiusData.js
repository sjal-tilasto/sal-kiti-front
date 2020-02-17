/**
 * Parses SIUS CSV data to results objects
 *
 * @param {array} data
 * @returns {array} list of results objects
 */
export default function(data) {
  let results = [];
  let headerRow = null;
  let headers = {};
  let partial = {};
  /* Header row is usally around 7th line */
  for (const row in data) {
    if (data[row].length > 1 && data[row][1] === "Rank") {
      headerRow = parseInt(row);
      break;
    }
  }
  if (headerRow && data.length > headerRow) {
    for (const col in data[headerRow]) {
      switch (data[headerRow][col]) {
        case "Rank":
          headers.rank = parseInt(col);
          break;
        case "Bib No":
          headers.id = parseInt(col);
          break;
        case "Category":
          headers.category = parseInt(col);
          break;
        case "Name":
          headers.name = parseInt(col);
          break;
        case "Nation":
        case "Nat":
          headers.organization = parseInt(col);
          break;
        case "Total":
          headers.total = parseInt(col);
          break;
        case "Remarks":
          headers.remarks = parseInt(col);
          break;
        case "Sub Total":
          headers.subtotal = parseInt(col);
          break;
        case "Series":
          headers.series = parseInt(col);
          break;
        case "Position":
          headers.position = parseInt(col);
          break;
        default:
          break;
      }
    }
    /* Check for extra header row for partial results */
    if (!data[headerRow + 1][headers.rank] && "series" in headers) {
      for (let i = headers.series; i < data[headerRow + 1].length; i++) {
        if (data[headerRow + 1][i]) {
          partial[data[headerRow + 1][i]] = i;
        }
      }
    }
    for (let i = headerRow + 1; i < data.length; i++) {
      let result = {};
      /* First result row for each result includes rank: set rank and calculate number of lines in a result */
      if (data[i][headers.rank] && parseInt(data[i][headers.rank])) {
        result.position = parseInt(data[i][headers.rank]);
        let resultLines = 1;
        for (let l = 1; l < data.length - i; l++) {
          if (data[i + l][headers.rank]) {
            resultLines = l;
            break;
          }
        }
        if (headers.id && data[i][headers.id]) {
          result.sport_id = data[i][headers.id];
        }
        if (headers.name && data[i][headers.name]) {
          let names = data[i][headers.name].split(" ");
          result.last_name = names[0];
          if (names.length > 1) {
            result.first_name = names[1];
          }
        }
        if (headers.organization && data[i][headers.organization]) {
          result.organization = data[i][headers.organization];
        }
        /* Total sum is usually in the last result line and might contain number of x's */
        for (let n = 0; n < resultLines; n++) {
          if (headers.total && data[i + n][headers.total]) {
            let total = data[i + n][headers.total];
            if (total.includes("-")) {
              result.result = total.split("-")[0].trim();
              result["x-1"] = total
                .split("-")[1]
                .split("x")[0]
                .trim();
            }
          }
        }
        if (headers.remarks && data[i][headers.remarks]) {
          result.info = data[i][headers.remarks];
        }
        /* For postition competition there are multiple result lines */
        if (headers.position && data[i][headers.position]) {
          for (let n = 0; n < resultLines; n++) {
            let position = null;
            if (
              ["kneeling", "polvi"].includes(
                data[i + n][headers.position].toLowerCase()
              )
            ) {
              position = "kneel";
            } else if (
              ["prone", "makuu"].includes(
                data[i + n][headers.position].toLowerCase()
              )
            ) {
              position = "prone";
            } else if (
              ["standing", "pysty"].includes(
                data[i + n][headers.position].toLowerCase()
              )
            ) {
              position = "stand";
            }
            if (position) {
              Object.keys(partial).forEach(elem => {
                if (data[i + n][partial[elem]]) {
                  result[position + "-" + elem] = data[i + n][partial[elem]];
                }
              });
              if (headers.subtotal && data[i + n][headers.subtotal]) {
                result[position.charAt(0) + "sum-1"] =
                  data[i + n][headers.subtotal];
              }
            }
          }
        } else {
          Object.keys(partial).forEach(elem => {
            if (data[i][partial[elem]]) {
              result["part-" + elem] = data[i][partial[elem]];
            }
          });
        }
        results.push(result);
      }
    }
  }
  return results;
}
