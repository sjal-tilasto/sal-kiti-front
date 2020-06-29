<template>
  <div>
    <b-row>
      <b-col v-if="$store.state.editMode">
        <b-button
          :to="{ name: 'divari-competition-add' }"
          variant="light"
          class="btn-orange float-right"
        >
          {{ $tc("competition.add", 2) }}
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
        <b-table
          small
          :fields="resultFields"
          :items="competitions"
          @row-clicked="linkTo"
          @row-middle-clicked="linkToNewTab"
          hover
        >
          <template v-slot:cell(organization)="data">
            {{ data.item.organization }}
          </template>
          <template v-slot:cell(date)="data">
            {{ data.item.date }}
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
  name: "DivariCompetitionList",
  filters: {
    roundValue
  },
  props: {
    season: Number,
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
      competitions: []
    };
  },
  computed: {
    /**
     * Sets fields list for the competition list
     *
     * @returns {array} fields list
     */
    resultFields: function() {
      let fields = [
        { key: "organization", label: this.$t("organization") },
        { key: "date", label: this.$t("date") }
      ];
      return fields;
    }
  },
  mounted() {
    this.getCompetitions();
  },
  methods: {
    /**
     * Fetch competitions from API
     *
     * @returns {Promise<void>}
     */
    async getCompetitions() {
      this.loading = true;
      this.competitions = [];
      this.$set(this.errors, "main", null);
      let parameters =
        "?date_start=" + this.dateStart + "&date_end=" + this.dateEnd;
      if (this.limit) {
        parameters = parameters + "&limit=" + this.limit;
      }

      HTTP.get("divari/competitions/" + parameters)
        .then(response => {
          this.competitions = response.data.results || [];
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loading = false));
    },
    /**
     * Routes to competition information when row is clicked
     *
     * @param {object} item - athlete object
     */
    linkTo(item) {
      this.$router.push({
        name: "divari-competition",
        params: { competition_id: item.id }
      });
    },
    /**
     * Opens competition information in new window when row is clicked
     *
     * @param {object} item - athlete object
     */
    linkToNewTab(item) {
      let routeData = this.$router.resolve({
        name: "divari-competition",
        params: { competition_id: item.id }
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>

<style scoped></style>
