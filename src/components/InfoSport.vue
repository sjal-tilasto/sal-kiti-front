<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t("info.info") }}</h1>
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
        <h2 class="bg-sal-orange">{{ $t("info.sport") }}</h2>
      </b-col>
    </b-row>
    <b-row v-if="loadingSports">
      <b-col>
        <b-spinner label="Loading..."></b-spinner>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col>
        <b-button
          v-for="sport in sports"
          v-bind:key="sport.id"
          :pressed.sync="sport.state"
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectSport(sport.id)"
        >
          {{ sport.name }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-if="categories.length > 0">
        <h2 class="bg-sal-orange">{{ $tc("sport.category", 2) }}</h2>
        <b-table :fields="categoryFields" :items="categories">
          <template v-slot:cell(team)="data">
            <div v-if="data.item.team" class="text-success">
              &#10004;
            </div>
            <div v-else class="text-danger">
              &#10005;
            </div>
          </template>
        </b-table>
      </b-col>
      <b-col v-if="competitionTypes.length > 0">
        <h2 class="bg-sal-orange">{{ $tc("sport.competition_type", 2) }}</h2>
        <b-table
          :fields="competitionTypeFields"
          :items="competitionTypes"
          @row-clicked="linkTo"
          @row-middle-clicked="linkToNewTab"
          hover
        >
          <template v-slot:cell(personal)="data">
            <div v-if="data.item.personal" class="text-success">
              &#10004;
            </div>
            <div v-else class="text-danger">
              &#10005;
            </div>
          </template>
          <template v-slot:cell(team)="data">
            <div v-if="data.item.team" class="text-success">
              &#10004;
            </div>
            <div v-else class="text-danger">
              &#10005;
            </div>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Dispays sports information
 * - categories
 * - competition types
 */
import { HTTP } from "../api/BaseApi.js";
import errorParser from "../utils/ErrorParser";
import apiGet from "../mixins/ApiGet";

export default {
  name: "InfoSport",
  mixins: [apiGet],
  data() {
    return {
      categories: [],
      competitionTypes: [],
      errors: {},
      loadingSports: false,
      sport: null,
      sports: []
    };
  },
  computed: {
    /**
     * Sets fields list for the category list
     *
     * @returns {array} fields list
     */
    categoryFields: function() {
      return [
        { key: "abbreviation", label: this.$t("abbreviation") },
        { key: "name", label: this.$t("name") },
        { key: "team", label: this.$t("team") },
        { key: "gender", label: this.$t("gender") }
      ];
    },
    /**
     * Sets fields list for the competition type list
     *
     * @returns {array} fields list
     */
    competitionTypeFields: function() {
      return [
        { key: "abbreviation", label: this.$t("abbreviation") },
        { key: "name", label: this.$t("name") },
        { key: "personal", label: this.$t("personal") },
        { key: "team", label: this.$t("team") }
      ];
    }
  },
  mounted() {
    if (this.$route.query) {
      this.parseQueryParams();
    }
    this.getSports();
    document.title = this.$t("title.sports") + " | " + this.$t("title.prefix");
  },
  methods: {
    /**
     * Fetch sports list from API
     *
     * @returns {Promise<void>}
     */
    async getSports() {
      this.loadingSports = true;
      HTTP.get("sports/")
        .then(response => {
          this.sports = response.data.results;
          this.sports.forEach(obj => {
            obj.state = false;
          });
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingSports = false));
    },
    /**
     * Routes to competition type information when row is clicked
     *
     * @param {object} item - event object
     */
    linkTo(item) {
      this.$router.push({
        name: "info-competitiontype",
        params: { competition_type_id: item.id }
      });
    },
    /**
     * Opens competition type information in new window when row is clicked
     *
     * @param {object} item - event object
     */
    linkToNewTab(item) {
      let routeData = this.$router.resolve({
        name: "info-competitiontype",
        params: { competition_type_id: item.id }
      });
      window.open(routeData.href, "_blank");
    },
    /**
     * Parse sport from query parameters
     */
    parseQueryParams() {
      if (this.$route.query.sport) {
        this.selectSport(this.$route.query.sport);
      }
    },
    /**
     * Set sport
     * - trigger sport based API calls
     * - set router
     *
     * @param {number} id
     */
    selectSport(id) {
      this.$set(this.errors, "main", null);
      this.sport = id;
      this.sports.forEach(obj => {
        if (obj.id !== id) {
          obj.state = false;
        }
      });
      this.$router.push({ name: "info-sport", query: { sport: this.sport } });
      this.getCategories(id);
      this.getCompetitionTypes(id);
    }
  }
};
</script>

<style scoped></style>
