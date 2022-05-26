<template>
  <div>
    <b-row>
      <b-col>
        <h3 class="bg-sal-orange">
          {{ $tc("statistics.sal.pohjolan_malja", 2) }}
        </h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-alert v-if="errors.main" variant="danger" show>
          <ul>
            <li v-for="e in errors.main" v-bind:key="e">{{ e }}</li>
          </ul>
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          v-for="y in year_range"
          v-bind:key="y"
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="getStatistics(y)"
          :pressed="y === year"
        >
          {{ y }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table small :fields="resultFields" :items="results.results">
          <template v-slot:cell(value)="data">
            {{ data.item.value }}
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
/**
 * Displays Pohjolan malja statistics
 */
import { HTTP } from "../api/BaseApi.js";
import errorParser from "../utils/ErrorParser";

export default {
  name: "StatisticsPM",
  data() {
    return {
      currentYear: new Date().getFullYear(),
      errors: {},
      loading: false,
      results: [],
      year: new Date().getFullYear()
    };
  },
  computed: {
    /**
     * Sets fields list for the statistics list
     *
     * @returns {array} fields list
     */
    resultFields: function () {
      return [
        {
          key: "organization.name",
          label: this.$t("athlete.club")
        },
        {
          key: "organization.abbreviation",
          label: this.$t("abbreviation")
        },
        { key: "value", label: this.$tc("result.result", 1) }
      ];
    },
    /**
     * Sets year options list
     *
     * @returns {array} year list
     */
    year_range: function () {
      let years = [];
      let startYear = 2020;
      while (startYear <= this.currentYear) {
        years.push(startYear++);
      }
      return years;
    }
  },
  mounted() {
    this.getStatistics(this.year);
  },
  methods: {
    /**
     * Fetch Pohjolan malja statistics for a year from API
     *
     * @param {string} year
     * @returns {Promise<void>}
     */
    async getStatistics(year) {
      this.year = year;
      this.loading = true;
      this.results = [];
      this.$set(this.errors, "main", null);
      HTTP.get("sal/pohjolanmalja/" + year + "/")
        .then((response) => {
          this.results = response.data || [];
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>

<style scoped></style>
