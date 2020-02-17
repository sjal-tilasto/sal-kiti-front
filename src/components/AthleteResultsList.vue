<template>
  <div>
    <h3>{{ $tc("result.result", 2) }}</h3>
    <b-table
      :items="results"
      :fields="resultFields"
      sort-by="competition.date_start"
      sort-desc
      responsive="sm"
      @row-clicked="linkTo"
      @row-middle-clicked="linkToNewTab"
      hover
      small
    >
      <template v-slot:cell(info)="data">
        {{ data.item.info }}
        {{ data.item.record | parseRecords(true, true) }}
        <div v-if="!data.item.approved">({{ $t("result.unconfirmed") }})</div>
      </template>
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
 * Displays results list for a athlete
 */
import parseRecords from "../utils/ParseRecordsFilter";
import roundValue from "../utils/RoundValueFilter";

export default {
  name: "AthleteResultsList",
  filters: {
    parseRecords,
    roundValue
  },
  props: {
    results: Array
  },
  data() {
    return {
      selectMode: "single"
    };
  },
  computed: {
    /**
     * Sets fields list for the results table
     *
     * @returns {array} fields list
     */
    resultFields: function() {
      return [
        {
          key: "competition.date_start",
          label: this.$t("date"),
          sortable: true
        },
        {
          key: "competition.name",
          label: this.$tc("competition.competition", 1),
          sortable: true,
          thClass: "d-none d-lg-table-cell",
          tdClass: "d-none d-lg-table-cell"
        },
        {
          key: "competition.type_info.name",
          label: this.$tc("competition.type", 1),
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell",
          sortable: true
        },
        {
          key: "competition.type_info.abbreviation",
          label: this.$t("competition.type"),
          thClass: "d-md-none",
          tdClass: "d-md-none",
          sortable: true
        },
        {
          key: "competition.level_info.abbreviation",
          label: this.$tc("competition.level", 1),
          sortable: true,
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell"
        },
        {
          key: "category",
          label: this.$tc("competition.category", 1),
          sortable: true
        },
        {
          key: "position",
          label: "#",
          sortable: true,
          thClass: "d-none d-sm-table-cell",
          tdClass: "d-none d-sm-table-cell"
        },
        { key: "result", label: this.$tc("result.result", 1), sortable: true },
        {
          key: "info",
          label: this.$tc("result.info", 1),
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell"
        }
      ];
    }
  },
  methods: {
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
