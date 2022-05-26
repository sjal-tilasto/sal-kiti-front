<template>
  <div v-if="personalBest.length > 0">
    <h3>{{ $tc("result.personal_best", 2) }}</h3>
    <b-table
      :items="personalBest"
      :fields="personalBestFields"
      sort-by="competition.type_info.name"
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
 * Displays personal best results list for a athlete
 */
import roundValue from "../utils/RoundValueFilter";

export default {
  name: "AthletePersonalBestList",
  filters: {
    roundValue
  },
  props: {
    results: Array
  },
  data() {
    return {
      personalBest: [],
      selectMode: "single"
    };
  },
  computed: {
    /**
     * Sets fields list for the personal best table
     *
     * @returns {array} fields list
     */
    personalBestFields: function () {
      return [
        {
          key: "competition.type_info.name",
          label: this.$tc("competition.type", 1),
          sortable: true
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
          key: "competition.date_start",
          label: this.$t("date"),
          sortable: true
        }
      ];
    }
  },
  mounted() {
    this.personalBest = this.calculatePersonalBest(this.results);
  },
  methods: {
    /**
     * Creates a list of best results, based on competition type and category
     *
     * @param {array} results
     * @returns {array} best results
     */
    calculatePersonalBest(results) {
      let best = [];
      const sorted = results.sort(function (a, b) {
        return b.result - a.result;
      });
      sorted.forEach((item) => {
        if (
          !best.some(
            (el) =>
              el.category === item.category &&
              el.competition.type === item.competition.type
          )
        ) {
          best.push(item);
        }
      });
      return best;
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
