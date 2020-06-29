<template>
  <div v-if="competition">
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">
          {{ competition.organization }}: {{ competition.date }}
        </h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-if="$store.state.editMode">
        <b-button
          :to="{
            name: 'divari-import',
            params: { competition_id: competition.id }
          }"
          variant="light"
          class="btn-orange float-right"
        >
          {{ $t("result.import") }}
        </b-button>
      </b-col>
    </b-row>
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
        <b-table small :fields="resultFields" :items="results">
          <template v-slot:cell(bow_type)="data">
            <template v-if="data.item.bow_type === 'recurve'">
              {{ $t("sjal.recurve") }}
            </template>
            <template v-else-if="data.item.bow_type === 'compound'">
              {{ $t("sjal.compound") }}
            </template>
            <template v-else-if="data.item.bow_type === 'barebow'">
              {{ $t("sjal.barebow") }}
            </template>
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
  name: "DivariCompetitionResults",
  filters: {
    roundValue
  },

  data() {
    return {
      currentPage: 1,
      errors: {},
      loading: false,
      results: [],
      competition_id: null,
      competition: {}
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
        { key: "athlete", label: this.$tc("athlete.athlete", 1) },
        { key: "bow_type", label: this.$t("sjal.divari.bow_type") },
        { key: "target_type", label: this.$t("sjal.divari.target_type") },
        { key: "result", label: this.$tc("result.result", 1) }
      ];
      return fields;
    }
  },
  mounted() {
    this.getResults(this.$route.params.competition_id);
    this.getCompetition(this.$route.params.competition_id);
  },
  methods: {
    /**
     * Fetch competition from API
     *
     * @returns {Promise<void>}
     */
    async getCompetition(competition_id) {
      this.loading = true;
      this.competition = null;
      this.$set(this.errors, "main", null);
      HTTP.get("divari/competitions/" + competition_id + "/")
        .then(response => {
          this.competition = response.data || {};
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loading = false));
    },
    /**
     * Fetch results from API
     *
     * @returns {Promise<void>}
     */
    async getResults(competition_id) {
      this.loading = true;
      this.results = [];
      this.$set(this.errors, "main", null);
      let parameters = "?competition=" + competition_id;
      HTTP.get("divari/results/" + parameters)
        .then(response => {
          this.results = response.data.results || [];
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>

<style scoped></style>
