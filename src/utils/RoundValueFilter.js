import numberFormatter from "../utils/NumberFormatter";

/**
 * Round values to correct decimals and format value
 *
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export default function (value, decimals) {
  const val = parseFloat(value);
  if (!val) return "";
  if (!Number.isInteger(decimals)) return numberFormatter(val, "", ",");
  return numberFormatter(val.toFixed(decimals), "", ",");
}
