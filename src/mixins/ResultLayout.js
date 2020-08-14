export default {
  computed: {
    /**
     * Sets result blocks information based on layout
     * i.e. preliminary competition, finals etc.
     *
     * @returns {array} blocks
     */
    resultBlocks: function() {
      return this.customFields.filter(f => f.block === 0);
    },
    /**
     * Sets table fields for each result block, based on result columns
     *
     * @returns {[]|*[]} - array of table field arrays for each block
     */
    resultFields: function() {
      let fields = [];
      for (let block = 1; block <= this.maxBlock; block++) {
        fields[block] = [];
        if (
          this.resultCols.length >= block &&
          this.resultCols[block].length > 0
        ) {
          for (const order in this.resultCols[block]) {
            let field = {};
            field.key = this.resultCols[block][order].name;
            switch (this.resultCols[block][order].name) {
              case "athlete":
                field.label = this.$tc("athlete.athlete", 1);
                break;
              case "organization":
                field.label = this.$tc("athlete.club", 1);
                break;
              case "result":
                field.label = this.$tc("result.result", 1);
                break;
              case "pos":
                field.label = this.$tc("result.position", 1);
                break;
              case "info":
                field.label = this.$tc("result.info", 1);
                break;
              case "detail":
                field.label = this.$tc("result.details", 1);
                break;
              default:
                field.label = this.resultCols[block][order].label;
            }
            if (
              "hide" in this.resultCols[block][order] &&
              this.resultCols[block][order]["hide"]
            ) {
              field["thClass"] =
                "d-none d-" +
                this.resultCols[block][order]["hide"] +
                "-table-cell";
              field["tdClass"] =
                "d-none d-" +
                this.resultCols[block][order]["hide"] +
                "-table-cell";
            }
            field["sortable"] = true;
            fields[block].push(field);
          }
        }
      }
      return fields;
    },
    resultCols: function() {
      /**
       * Filters result columns from layout
       *
       * @returns {[]|*[]} - array of column arrays for each block
       */
      if (!this.customFields || this.customFields.length === 0) {
        return [];
      }
      let filtered = [];
      for (let i = 1; i <= this.maxBlock; i++) {
        filtered[i] = this.customFields.filter(
          f => f.block === i && f.row === 1
        );
      }
      return filtered;
    },
    /**
     * Filters extra fields, ones including '-' symbol, from layout
     * - Adds slot information for each field
     *
     * @returns {[]|*[]} - array of extra column arrays for each block
     */
    resultColsExtra: function() {
      if (!this.customFields || this.customFields.length === 0) {
        return [];
      }
      let filtered = [];
      for (let i = 1; i <= this.maxBlock; i++) {
        filtered[i] = [];
        filtered[i][0] = {};
        for (let r = 1; r <= 4; r++) {
          filtered[i][r] = this.customFields.filter(
            f => f.block === i && f.row === r && f.name && f.name.includes("-")
          );
          filtered[i][r].forEach(
            item => (item.slot = "cell(" + item.name.toString() + ")")
          );
          filtered[i][r].forEach(item => (filtered[i][0][item.col] = r));
        }
      }
      return filtered;
    }
  }
};
