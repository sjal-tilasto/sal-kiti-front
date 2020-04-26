/**
 * Sort results array by position, setting null positions last
 *
 * @param {array} array of results
 * @returns {array}
 */
export default function(array) {
  return array.sort(function(a, b) {
    return (
      (a.result === null) - (b.result === null) ||
      +(a.position > b.position) ||
      -(a.position < b.position)
    );
  });
}
