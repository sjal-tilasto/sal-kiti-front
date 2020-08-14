<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $tc("athlete.athlete", 2) }}</h1>
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
        <h2 class="bg-sal-orange">{{ $t("search.athlete") }}</h2>
        <b-form @submit="onSubmit" inline>
          <b-form-input
            type="text"
            class="search-field space-right"
            :aria-label="$t('search.placeholder_athlete')"
            :placeholder="$t('search.placeholder_athlete')"
            v-model.lazy="form.search"
          />
          <b-form-select
            class="search-field space-right"
            v-model.lazy="form.limit"
            :aria-label="$t('search.max_results')"
          >
            <option v-for="i in ['10', '25', '50', '100']" :key="i" :value="i">
              {{ i }}
            </option>
          </b-form-select>
          <b-button
            type="submit"
            variant="light"
            class="btn-orange space-right"
            >{{ $t("search.search") }}</b-button
          >
        </b-form>
      </b-col>
    </b-row>
    <br />
    <b-row>
      <b-col>
        <h3 class="bg-sal-orange">{{ $tc("result.result", 2) }}</h3>
        <b-pagination
          v-model="currentPage"
          :total-rows="results.count"
          :per-page="results.limit"
          align="right"
          v-if="results.count > results.limit"
        >
        </b-pagination>
        <p class="text-right" v-if="results.count">
          {{ $t("search.count") }}: {{ results.count }}
        </p>
        <b-table
          id="my-table"
          :fields="resultFields"
          :items="results.results"
          :current-page="currentPage"
          :per-page="0"
          @row-clicked="linkTo"
          @row-middle-clicked="linkToNewTab"
          hover
        >
        </b-table>
        <div v-show="loadingAthletes">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Athlete search
 *
 * Allows searching athletes by name or sport ID and lists paginated results
 */
import { HTTP } from "../api/BaseApi.js";
import errorParser from "../utils/ErrorParser";

export default {
  name: "AthleteSearch",
  data: function() {
    return {
      currentPage: 1,
      errors: {},
      form: {
        search: "",
        limit: 10
      },
      loadingAthletes: false,
      results: [],
      searchParams: ""
    };
  },
  computed: {
    /**
     * Creates fields list for the athletes list table
     *
     * @returns {array} fields list
     */
    resultFields: function() {
      return [
        { key: "sport_id", label: this.$t("athlete.sport_id") },
        { key: "first_name", label: this.$t("first_name") },
        { key: "last_name", label: this.$t("last_name") },
        { key: "organization_info.name", label: this.$t("athlete.club") }
      ];
    }
  },
  watch: {
    /**
     * Recalculate search parameters if page changes
     */
    currentPage: {
      handler: function() {
        this.getAthletes(this.searchParams);
      }
    },
    /**
     * Fetch athletes when search parameters change
     */
    searchParams: {
      handler: function() {
        this.currentPage = 1;
        this.getAthletes(this.searchParams);
      }
    }
  },
  mounted: function() {
    if (this.$route.query) {
      this.parseQueryParams();
    }
  },
  methods: {
    /**
     * Fetch athletes from API
     *
     * @param {string} searchParams
     * @returns {Promise<void>}
     */
    async getAthletes(searchParams) {
      this.$set(this.errors, "main", null);
      this.loadingAthletes = true;
      if (this.currentPage) {
        if (
          !this.results.count ||
          this.results.count <= (this.currentPage - 1) * this.limit
        ) {
          this.currentPage = 1;
        }
      }
      HTTP.get("athletes/" + searchParams + "&page=" + this.currentPage)
        .then(response => {
          this.results = response.data;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingAthletes = false));
    },
    /**
     * Routes to athlete information when row is clicked
     *
     * @param {object} item - athlete object
     */
    linkTo(item) {
      this.$router.push({ name: "athlete", params: { athlete_id: item.id } });
    },
    /**
     * Opens athlete information in new window when row is clicked
     *
     * @param {object} item - athlete object
     */
    linkToNewTab(item) {
      let routeData = this.$router.resolve({
        name: "athlete",
        params: { athlete_id: item.id }
      });
      window.open(routeData.href, "_blank");
    },
    /**
     * Calculates search parameters and sets route
     *
     * @param evt
     */
    onSubmit(evt) {
      if (evt) {
        evt.preventDefault();
      }
      if (this.form.search) {
        let parameters = "?search=" + this.form.search;
        let query = {};
        query.search = this.form.search;
        if (this.form.limit) {
          parameters += "&limit=" + this.form.limit;
          query.limit = this.form.limit;
        }
        this.searchParams = parameters;
        this.$router.push({ name: "athlete-search", query: query }, () => {});
      }
    },
    /**
     * Parses query parameters
     */
    parseQueryParams() {
      if (this.$route.query.search) {
        this.form.search = this.$route.query.search;
      }
      if (this.$route.query.limit) {
        this.form.limit = this.$route.query.limit;
      }
      if (this.$route.query.load) {
        this.onSubmit();
      }
    }
  }
};
</script>

<style scoped></style>
