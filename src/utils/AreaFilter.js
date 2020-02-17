/**
 * Return areas by id
 *
 * @param {array} areas
 * @param {array} areaList
 * @returns {string}
 */
export default function(areas, areaList) {
  let return_list = "";
  areas.forEach(function(area) {
    let filtered = areaList.filter(obj => obj.id === area);
    if (filtered.length === 1) {
      if (return_list !== "") {
        return_list += ", " + filtered[0].name;
      } else {
        return_list = filtered[0].name;
      }
    }
  });
  return return_list;
}
