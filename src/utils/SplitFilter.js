/**
 * Split value to array and return specific value
 *
 * @param {string} value
 * @param {string} split
 * @param {number} part
 * @returns {string}
 */
export default function (value, split, part = 0) {
  let string = value.toString().split(split);
  if (string.length > part) {
    return string[part].trim();
  }
  return "";
}
