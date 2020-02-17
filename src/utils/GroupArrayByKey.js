/**
 * Groups array by specific key
 * - optionally adds max rounds information if partial_type is given
 *
 * @param {array} array of objects
 * @param {string} key
 * @param {string} partial_type
 * @returns {array}
 */
export default function(array, key, partial_type = null) {
  let result = {};
  array.forEach(item => {
    let value = item[key];
    if (typeof item[key] !== "number") {
      value = item[key].split("(")[0].trim();
    }
    if (!result[value]) {
      result[value] = [];
    }
    result[value].push(item);
  });
  if (partial_type) {
    return maxRounds(result, partial_type);
  } else {
    return result;
  }
}

/**
 * Calculates maximum order for a specific partial result from all results in category
 * - sets max_rounds field to first result of the category
 *
 * @param {array} result
 * @param {string} partial_type
 * @returns {array}
 */
function maxRounds(result, partial_type) {
  Object.keys(result).forEach(category => {
    let order = 0;
    result[category].forEach(item => {
      if (item.partial) {
        item.partial.forEach(partial => {
          if (
            partial.order > order &&
            partial.type.abbreviation.includes(partial_type)
          ) {
            order = partial.order;
          }
        });
      }
    });
    result[category][0].max_rounds = order;
  });
  return result;
}
