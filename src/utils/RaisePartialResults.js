/**
 * Raises partial results in the array to one level upwards
 *
 * @param {array} array of objects
 * @param {string} raised, partial result type abbreviation
 * @param {boolean} isinteger, if value is integer
 * @returns {array}
 */
export default function(array, raised, isinteger = true) {
  let result = {};
  array.forEach(item => {
    if ("partial" in item) {
      let items = item["partial"].filter(
        elem => elem["type"]["abbreviation"] === raised
      );
      for (let i = 0; i < items.length; i++) {
        if (isinteger) {
          item[raised + "-" + items[i]["order"]] = parseInt(items[i]["value"]);
        } else {
          item[raised + "-" + items[i]["order"]] = items[i]["value"];
        }
      }
    }
  });
  return array;
}
