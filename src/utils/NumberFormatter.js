/**
 * Formats number to string with deciamal and thousand separators
 *
 * @param {number} number
 * @param {string} thousandSeparator
 * @param {string} decimalSeparator
 * @returns {string}
 */
export default function(number, thousandSeparator, decimalSeparator) {
  let parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  return parts.join(decimalSeparator);
}
