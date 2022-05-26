/**
 * Return textual representation from the list of records
 * i.e. "WR M18, ER M"
 *
 * @param {array} records
 * @param {boolean} include_preliminary in brackets
 * @param {boolean} levels_only - does not include category info
 * @returns {string}
 */
export default function (
  records,
  include_preliminary = false,
  levels_only = false
) {
  let results = [];
  let levels = [];
  for (let record in records) {
    if (records[record].date_end === null) {
      let result = null;
      if (records[record].approved) {
        result = records[record].level + " " + records[record].category;
      } else if (include_preliminary) {
        result =
          "(" + records[record].level + " " + records[record].category + ")";
      }
      if (result && !results.includes(result)) {
        results.push(result);
      }
      if (result && !levels.includes(records[record].level)) {
        levels.push(records[record].level);
      }
    }
  }
  if (results === []) return "";
  if (levels_only) {
    return levels.join(" ");
  }
  return results.join(", ");
}
