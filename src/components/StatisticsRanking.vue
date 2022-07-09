<template>
  <div>
    <b-row>
      <b-col>
        <b-alert v-if="errors.main" variant="danger" show="true">
          <ul>
            <li v-for="e in errors.main" v-bind:key="e">{{ e }}</li>
          </ul>
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table
          small
          :fields="resultFields"
          :items="results.results"
          @row-clicked="linkTo"
          @row-middle-clicked="linkToNewTab"
          hover
        >
          <template v-slot:cell(athlete)="data">
            {{ data.item.athlete.first_name }}
            {{ data.item.athlete.last_name }}
          </template>
          <template v-slot:cell(organization)="data">
            {{ data.item.athlete.organization }}
          </template>
          <template v-slot:cell(result)="data">
            {{ data.item.result | roundValue(0) }}
          </template>
        </b-table>
        <div v-show="loading">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { HTTP } from "../api/BaseApi.js";
import roundValue from "../utils/RoundValueFilter";
import errorParser from "../utils/ErrorParser";

export default {
  name: "StatisticsRanking",
  filters: {
    roundValue
  },
  props: {
    division: String,
    dateStart: String,
    dateEnd: String,
    limit: Number,
    limited: Boolean
  },
  data() {
    return {
      currentPage: 1,
      errors: {},
      loading: false,
      results: []
    };
  },
  computed: {
    /**
     * Sets fields list for the statistics list
     *
     * @returns {array} fields list
     */
    resultFields: function () {
      let fields = [
        { key: "rank", label: "#" },
        { key: "athlete", label: this.$tc("athlete.athlete", 1) },
        { key: "organization", label: this.$t("athlete.club") },
        { key: "result", label: this.$tc("result.result", 1) }
      ];
      if (!this.limited) {
        fields.push({
          key: "competitions",
          label: this.$t("sjal.ranking_competitions")
        });
      }
      return fields;
    }
  },
  mounted() {
    this.getStatistics();
  },
  methods: {
    /**
     * Fetch statistics from API
     *
     * @returns {Promise<void>}
     */
    async getStatistics() {
      this.loading = true;
      this.results = [];
      this.$set(this.errors, "main", null);
      let parameters =
        "?date_start=" + this.dateStart + "&date_end=" + this.dateEnd;
      if (this.limit) {
        parameters = parameters + "&limit=" + this.limit;
      }

      HTTP.get("sjal/ranking/" + this.division.toLowerCase() + "/" + parameters)
        .then((response) => {
          this.results = response.data || [];
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loading = false));
    },
    /**
     * Routes to athlete information when row is clicked
     *
     * @param {object} item - athlete object
     */
    linkTo(item) {
      this.$router.push({
        name: "athlete",
        params: { athlete_id: item.athlete.id }
      });
    },
    /**
     * Opens athlete information in new window when row is clicked
     *
     * @param {object} item - athlete object
     */
    linkToNewTab(item) {
      let routeData = this.$router.resolve({
        name: "athlete",
        params: { athlete_id: item.athlete.id }
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>

<style scoped></style>
