<template>
  <div v-if="recordList.length > 0">
    <h3>{{ $tc("record.record", 2) }}</h3>
    <b-table
      :items="recordList"
      :fields="recordFields"
      sort-by="type_abbreviation"
      responsive="sm"
      @row-clicked="linkTo"
      @row-middle-clicked="linkToNewTab"
      hover
      small
    >
      <template v-slot:cell(result)="data">
        <div v-if="data.item.result_code && !data.item.result">
          {{ data.item.result_code }}
        </div>
        <div v-else-if="data.item.result_code && data.item.result">
          {{ data.item.result_code }}
          ({{ data.item.result | roundValue(data.item.decimals) }})
        </div>
        <div v-else>
          {{ data.item.result | roundValue(data.item.decimals) }}
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
/**
 * Displays records list for a athlete
 */
import roundValue from "../utils/RoundValueFilter";

export default {
  name: "AthleteRecordsList",
  filters: {
    roundValue
  },
  props: {
    results: Array
  },
  data() {
    return {
      recordList: [],
      selectMode: "single"
    };
  },
  computed: {
    /**
     * Sets fields list for the records table
     *
     * @returns {array} fields list
     */
    recordFields: function() {
      return [
        {
          key: "level",
          label: this.$tc("record.record", 1),
          sortable: true
        },
        {
          key: "type_name",
          label: this.$tc("competition.type", 1),
          sortable: true,
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell"
        },
        {
          key: "type_abbreviation",
          label: this.$tc("competition.type", 1),
          sortable: true,
          thClass: "d-md-none",
          tdClass: "d-md-none"
        },
        {
          key: "category",
          label: this.$tc("competition.category", 1),
          sortable: true
        },
        {
          key: "result",
          label: this.$tc("result.result", 1),
          sortable: true
        },
        {
          key: "date",
          label: this.$t("date"),
          sortable: true
        }
      ];
    }
  },
  mounted() {
    this.recordList = this.calculateRecordList(this.results);
  },
  methods: {
    /**
     * Creates a list of records from the results
     *
     * @param {array} results
     * @returns {array} records
     */
    calculateRecordList(results) {
      let records = [];
      const filtered = results.filter(
        el => "record" in el && el.record.length > 0
      );
      filtered.forEach(item => {
        item.record.forEach(el => {
          if (el.date_end === null && el.partial_result) {
            let partial = item.partial.filter(
              part => part.id === el.partial_result
            )[0];
            records.push({
              level: el.level,
              type_name:
                item.competition.type_info.name + " - " + partial.type.name,
              type_abbreviation:
                item.competition.type_info.abbreviation +
                " - " +
                partial.type.name,
              category: el.category,
              result: partial.value,
              date: item.competition.date_start,
              competition: { id: item.competition.id }
            });
          } else if (el.date_end === null) {
            records.push({
              level: el.level,
              type_name: item.competition.type_info.name,
              type_abbreviation: item.competition.type_info.abbreviation,
              category: el.category,
              result: item.result,
              date: item.competition.date_start,
              competition: { id: item.competition.id }
            });
          }
        });
      });
      return records;
    },
    /**
     * Routes to competition information when row is clicked
     *
     * @param {object} item - competition object
     */
    linkTo(item) {
      this.$router.push({
        name: "competition",
        params: { competition_id: item.competition.id }
      });
    },
    /**
     * Opens competition information in new window when row is clicked
     *
     * @param {object} item - competition object
     */
    linkToNewTab(item) {
      let routeData = this.$router.resolve({
        name: "competition",
        params: { competition_id: item.competition.id }
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>

<style scoped></style>
