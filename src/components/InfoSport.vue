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
    <b-row>
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
        <b-table :fields="competitionTypeFields" :items="competitionTypes">
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

export default {
  name: "InfoSport",
  data() {
    return {
      categories: [],
      competitionTypes: [],
      errors: {},
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
     * Fetch current categories for a sport from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getCategories(id) {
      HTTP.get("categories/?sport=" + id + "&historical=false")
        .then(response => {
          this.categories = response.data.results;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch current competition types for a sport from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getCompetitiontypes(id) {
      HTTP.get("competitiontypes/?sport=" + id + "&historical=false")
        .then(response => {
          this.competitionTypes = response.data.results;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch sports list from API
     *
     * @returns {Promise<void>}
     */
    async getSports() {
      HTTP.get("sports/")
        .then(response => {
          this.sports = response.data.results;
          this.sports.forEach(obj => {
            obj.state = false;
          });
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
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
      this.getCompetitiontypes(id);
    }
  }
};
</script>

<style scoped></style>
