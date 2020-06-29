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
    <b-row v-for="(division, index) in results" :key="index">
      <b-col v-if="division">
        <h4 class="bg-sal-orange">
          {{ $t("sjal.divari.division") }} {{ division[0].team.division }}
        </h4>
        <b-table small :fields="resultFields" :items="division">
          <template v-slot:cell(team.organization)="data">
            {{ data.item.team.organization }}
            {{ data.item.team.number }}
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
  name: "DivariSeasonResults",
  filters: {
    roundValue
  },
  props: {
    season: Number,
    bowType: String,
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
     * Sets fields list for the results list
     *
     * @returns {array} fields list
     */
    resultFields: function() {
      let fields = [
        { key: "team.organization", label: this.$t("sjal.divari.team") },
        { key: "result", label: this.$tc("result.result", 1) }
      ];
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
        "?team__season=" +
        this.season +
        "&team__bow_type=" +
        this.bowType.toLowerCase();
      if (this.limit) {
        parameters = parameters + "&limit=" + this.limit;
      }

      HTTP.get("divari/seasonresults/" + parameters)
        .then(response => {
          let data = response.data.results || [];
          this.results = [];
          data.forEach(item => {
            let value = item.team.division;
            if (!this.results[value]) {
              this.results[value] = [];
            }
            this.results[value].push(item);
          });
        })
        .catch(error => {
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
