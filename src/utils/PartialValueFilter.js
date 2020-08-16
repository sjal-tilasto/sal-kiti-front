import numberFormatter from "../utils/NumberFormatter";

/**
 * Parse and format specific partial value from a result object
 *
 * @param {object} value - result object
 * @param {string} type - partial result type
 * @param {number} order
 * @returns {string}
 */
export default function(value, type, order = null) {
  if (!value) return "";
  if (!order) {
    let values = type.split("-");
    type = values[0];
    order = parseInt(values[1]);
  }
  const result = value.filter(
    v => v.type && v.type.abbreviation === type && v.order === order
  )[0];
  if (result) {
    if (result.text) {
      return result.text;
    } else {
      return numberFormatter(
        Number(result.value).toFixed(result.decimals),
        "",
        ","
      );
    }
  }
  return "";
}
