<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $tc("competition.competition", 2) }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">{{ $t("search.competition") }}</h2>
        <b-button
          v-for="sport in sports"
          v-bind:key="sport.id"
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectSport(sport.id)"
        >
          {{ sport.name }}
        </b-button>
      </b-col>
    </b-row>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-row>
        <b-col cols="12" md="6" xl="4">
          <b-form-group
            id="input-group-competition-level"
            :label="$t('competition.level')"
            label-for="input-competition-level"
            :description="$t('statistics.choose_multiple')"
          >
            <b-form-select
              id="input-competition-level"
              v-model="form.competitionLevel"
              :options="competitionLevels"
              textField="name"
              valueField="id"
              multiple
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4">
          <b-form-group
            id="input-group-date-start"
            :label="$t('date_start')"
            label-for="input-date-start"
          >
            <b-form-input
              id="input-date-start"
              v-model="form.date_start"
              type="date"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-date-end"
            :label="$t('date_end')"
            label-for="input-date-end"
          >
            <b-form-input
              id="input-date-end"
              v-model="form.date_end"
              type="date"
            ></b-form-input>
            <b-button
              size="sm"
              variant="light"
              class="btn-orange space-right space-top"
              v-on:click="setCurrentYear"
            >
              {{ $t("statistics.current_year") }}
            </b-button>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4" v-if="sport">
          <b-form-group
            id="input-group-competition-type"
            :label="$t('competition.type')"
            label-for="input-competition-type"
            :description="$t('statistics.choose_multiple')"
          >
            <b-form-select
              id="input-competition-type"
              v-model="form.competitionType"
              :options="competitionTypes"
              textField="name"
              valueField="id"
              multiple
            >
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" md="6" xl="4">
          <b-button
            type="submit"
            variant="light"
            class="btn-orange space-right space-down"
          >
            {{ $t("search.search") }}</b-button
          >
          <b-button type="reset" variant="danger" class="space-down">{{
            $t("reset")
          }}</b-button>
        </b-col>
      </b-row>
    </b-form>
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
        <h3 class="bg-sal-orange">{{ $tc("result.result", 2) }}</h3>
        <b-pagination
          v-model="currentPage"
          :total-rows="competitions.count"
          :per-page="competitions.limit"
          align="right"
          v-if="competitions.count > competitions.limit"
        >
        </b-pagination>
        <p class="text-right" v-if="competitions.count">
          {{ $t("search.count") }}: {{ competitions.count }}
        </p>
        <b-table
          :fields="listFields"
          :items="competitions.results"
          :current-page="currentPage"
          :per-page="0"
          @row-clicked="linkTo"
          @row-middle-clicked="linkToNewTab"
          hover
        >
          <template v-slot:cell(date)="data">
            <div v-if="data.item.date_start === data.item.date_end">
              {{ data.item.date_start }}
            </div>
            <div v-else>
              {{ data.item.date_start }} - {{ data.item.date_end }}
            </div>
          </template>
          <template v-slot:cell(type_info.name)="data">
            {{ data.item.type_info.name }}
            <div v-if="data.item.event_info">
              <router-link
                tag="a"
                :to="{
                  name: 'event',
                  params: {
                    event_id: data.item.event_info.id
                  }
                }"
                >{{ data.item.event_info.name }}</router-link
              >
            </div>
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
 * Displays a search form for competitions and results
 */
import { HTTP } from "../api/BaseApi.js";
import errorParser from "../utils/ErrorParser";

export default {
  name: "CompetitionSearch",
  props: {
    createPermission: Boolean
  },
  data() {
    return {
      competitionLevels: [],
      competitionTypes: [],
      competitions: [],
      currentPage: 1,
      errors: {},
      form: {
        competitionLevel: [],
        competitionType: [],
        date_end: null,
        date_start: null
      },
      limit: 25,
      loading: false,
      parameters: "",
      searchParams: "",
      selectMode: "single",
      sport: null,
      sports: []
    };
  },
  computed: {
    /**
     * Sets fields list for the competition table
     *
     * @returns {array} fields list
     */
    listFields: function() {
      return [
        { key: "date", label: this.$t("date") },
        {
          key: "type_info.name",
          label: this.$t("competition.type"),
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell"
        },
        {
          key: "type_info.abbreviation",
          label: this.$t("competition.type"),
          thClass: "d-md-none",
          tdClass: "d-md-none"
        },
        {
          key: "level_info.name",
          label: this.$t("competition.level"),
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell"
        },
        {
          key: "level_info.abbreviation",
          label: this.$t("competition.level"),
          thClass: "d-md-none",
          tdClass: "d-md-none"
        }
      ];
    }
  },
  watch: {
    /**
     * Fetch new set of competitions on page change
     */
    currentPage: {
      handler: function() {
        this.getCompetitions(this.searchParams);
      }
    },
    /**
     * Fetch competitions when search parameters change
     */
    searchParams: {
      handler: function() {
        this.currentPage = 1;
        this.getCompetitions(this.searchParams);
      }
    }
  },
  mounted() {
    if (this.$route.query) {
      this.parseQueryParams();
    }
    this.getSports();
    this.getCompetitionlevels();
  },
  methods: {
    /**
     * Reset search form
     */
    formReset() {
      this.form.competitionLevel = [];
      this.form.competitionType = [];
      this.form.date_end = null;
      this.form.date_start = null;
    },
    /**
     * Fetch competition levels from API
     *
     * @returns {Promise<void>}
     */
    async getCompetitionlevels() {
      HTTP.get("competitionlevels/")
        .then(response => {
          this.competitionLevels = response.data.results;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch competition types for a single sport from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getCompetitiontypes(id) {
      HTTP.get("competitiontypes/?sport=" + id)
        .then(response => {
          this.competitionTypes = response.data.results;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch competitions from API, based on search parameters
     *
     * @returns {Promise<void>}
     */
    async getCompetitions(searchParams) {
      this.$set(this.errors, "main", null);
      this.loading = true;
      if (this.currentPage) {
        if (
          !this.competitions.count ||
          this.competitions.count <= (this.currentPage - 1) * this.limit
        ) {
          this.currentPage = 1;
        }
      }
      HTTP.get("competitions/" + searchParams + "&page=" + this.currentPage)
        .then(response => {
          this.competitions = response.data || [];
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loading = false));
    },
    /**
     * Fetch sports from API
     *
     * @returns {Promise<void>}
     */
    async getSports() {
      HTTP.get("sports/")
        .then(response => {
          this.sports = response.data.results;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Routes to competition information when row is clicked
     *
     * @param {object} item - competition object
     */
    linkTo(item) {
      this.$router.push({
        name: "competition",
        params: { competition_id: item.id }
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
        params: { competition_id: item.id }
      });
      window.open(routeData.href, "_blank");
    },
    /**
     * Call form reset when reset button is pressed
     *
     * @param evt
     */
    onReset(evt) {
      evt.preventDefault();
      this.formReset();
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
      let query = {};
      let parameters = "?limit=" + this.limit;
      query.limit = this.limit;
      if (this.sport) {
        query.sport = this.sport;
        parameters += "&sport=" + this.sport;
      }
      if (this.form.competitionLevel.length) {
        parameters += "&level=" + this.form.competitionLevel;
        query.level = this.form.competitionLevel;
      }
      if (this.form.competitionType.length) {
        parameters += "&type=" + this.form.competitionType;
        query.type = this.form.competitionType;
      }
      if (this.form.date_start != null) {
        parameters += "&start=" + this.form.date_start;
        query.start = this.form.date_start;
      }
      if (this.form.date_end != null) {
        parameters += "&end=" + this.form.date_end;
        query.end = this.form.date_end;
      }
      this.searchParams = parameters;
      this.$router.push({ name: "competition-search", query: query }, () => {});
    },
    /**
     * Parses query parameters ans sets form information based on them
     */
    parseQueryParams() {
      if (this.$route.query.sport) {
        this.selectSport(this.$route.query.sport, false);
      }
      if (this.$route.query.level) {
        this.form.competitionLevel = JSON.parse(
          "[" + this.$route.query.level + "]"
        );
      }
      if (this.$route.query.type) {
        this.form.competitionType = JSON.parse(
          "[" + this.$route.query.type + "]"
        );
      }
      if (this.$route.query.start) {
        this.form.date_start =
          this.$route.query.start.substring(0, 4) +
          "-" +
          this.$route.query.start.substring(5, 7) +
          "-" +
          this.$route.query.start.substring(8, 10);
      }
      if (this.$route.query.end) {
        this.form.date_end =
          this.$route.query.end.substring(0, 4) +
          "-" +
          this.$route.query.end.substring(5, 7) +
          "-" +
          this.$route.query.end.substring(8, 10);
      }
      if (this.$route.query.load) {
        this.onSubmit();
      }
    },
    /**
     * Sets sport and loads competition types for it
     *
     * @param {number} id
     * @param {boolean} reset
     */
    selectSport(id, reset = true) {
      this.$set(this.errors, "main", null);
      this.sport = id;
      this.getCompetitiontypes(id);
      if (reset) {
        this.formReset();
      }
    },
    /**
     * Sets form dates to start and end of current year
     */
    setCurrentYear() {
      this.form.date_start = new Date().getFullYear() + "-01-01";
      this.form.date_end = new Date().getFullYear() + "-12-31";
    }
  }
};
</script>

<style scoped></style>
