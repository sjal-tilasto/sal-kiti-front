/**
 * API call error parser
 */
const valid_error_codes = [400, 403, 404, 500];

export default {
  /**
   * Parse generic errors from API calls
   *
   * @param {object} error
   * @returns {array} errors
   */
  generic: function(error) {
    let errors = [];
    if (error.response) {
      if (error.response.status === 403) {
        errors.push(this.$t("import.error.permission"));
      } else if (error.response.status === 404) {
        errors.push(this.$t("import.error.notfound"));
      } else if (error.response.status === 500) {
        errors.push(this.$t("import.error.server"));
      } else if (error.response.status === 400) {
        errors.push(this.$t("import.error.invalid"));
      } else {
        errors.push(this.$t("import.error.unknown"));
      }
    } else {
      errors.push(this.$t("import.error.connection"));
    }
    return errors;
  },
  /**
   * Parse errors from partial result management API calls
   *
   * @param {object} error
   * @returns {array} errors
   */
  partialResult: function(error) {
    let errors = [];
    if (error.response && valid_error_codes.includes(error.response.status)) {
      const entries = Object.entries(error.response.data);
      for (const entry of entries) {
        if (entry[0] === "non_field_errors") {
          errors.push(this.$t("import.error.partial") + ", " + entry[1]);
        } else {
          errors.push(
            this.$t("import.error.partial") +
              "; " +
              this.$t("import.error.invalid") +
              " " +
              entry[0]
          );
        }
      }
    } else if (error.response) {
      errors.push(this.$t("import.error.unknown"));
    } else {
      errors.push(this.$t("import.error.connection"));
    }
    return errors;
  },
  /**
   * Parse errors from result management API calls
   *
   * @param {object} error
   * @returns {array} errors
   */
  result: function(error) {
    let errors = [];
    if (error.response && valid_error_codes.includes(error.response.status)) {
      const entries = Object.entries(error.response.data);
      for (const entry of entries) {
        if (entry[0] === "non_field_errors") {
          for (const e of entry[1]) {
            errors.push(e);
          }
        } else if (entry[0] === "partial") {
          entry[1].forEach(part => {
            if ("value" in part) {
              errors.push(
                this.$t("import.error.partial") + ", " + part["value"]
              );
            }
          });
        } else {
          if (error.response.status === 403) {
            errors.push(this.$t("import.error.permission_result"));
          } else if (
            entry.length > 1 &&
            Array.isArray(entry[1]) &&
            entry[1].length > 0
          ) {
            errors.push(
              this.$t("import.error.invalid") +
                " " +
                entry[0] +
                ": " +
                entry[1][0]
            );
          } else {
            errors.push(this.$t("import.error.invalid") + " " + entry[0]);
          }
        }
      }
    } else if (error.response) {
      errors.push(this.$t("import.error.unknown"));
    } else {
      errors.push(this.$t("import.error.connection"));
    }
    return errors;
  }
};
