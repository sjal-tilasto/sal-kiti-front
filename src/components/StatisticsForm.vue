<template>
  <div>
    <b-row>
      <b-col>
        <b-alert v-if="errors.main" variant="danger" show>
          <ul>
            <li v-for="e in errors.main" v-bind:key="e">{{ e }}</li>
          </ul>
        </b-alert>
      </b-col>
    </b-row>
    <b-row v-if="loadingSports">
      <b-col>
        <b-spinner label="Loading..."></b-spinner>
      </b-col>
    </b-row>
    <b-form @submit="onSubmit" @reset="onReset" v-if="sport">
      <b-row>
        <b-col cols="12" md="6" xl="4">
          <b-form-group
            id="input-group-division"
            :label="$t('result.division')"
            label-for="input-division"
            :description="$t('statistics.choose_multiple')"
          >
            <b-form-select
              id="input-category"
              v-model="form.division"
              :options="divisions"
              textField="name"
              valueField="id"
              multiple
              :select-size="10"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4">
          <b-form-group
            id="input-group-category"
            :label="$t('result.category')"
            label-for="input-category"
            :description="$t('statistics.choose_multiple')"
          >
            <b-form-select
              id="input-category"
              v-model="form.category"
              :options="filteredCategories"
              textField="name"
              valueField="id"
              multiple
              :select-size="10"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4">
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
              :select-size="10"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
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
        <b-col cols="12" md="6" xl="4" v-if="showExtraFields">
          <b-form-group
            id="input-group-organization"
            :label="$t('athlete.club')"
            label-for="input-organization"
            :description="$t('statistics.choose_multiple')"
          >
            <b-form-select
              id="input-organization"
              v-model="form.organization"
              :options="organizations"
              textField="name"
              valueField="id"
              multiple
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4" v-if="showExtraFields">
          <b-form-group
            id="input-group-max-results"
            :label="$t('search.max_results')"
            label-for="input-max-results"
          >
            <b-form-select id="input-max-results" v-model="form.max_results">
              <option
                v-for="i in ['10', '25', '50', '100']"
                :key="i"
                :value="i"
              >
                {{ i }}
              </option>
            </b-form-select>
            <b-form-checkbox
              id="checkbox-approved"
              v-model="form.approved"
              name="checkbox-approved"
            >
              {{ $t("statistics.approved_only") }}
            </b-form-checkbox>
            <b-form-checkbox
              id="checkbox-trial"
              v-model="form.trial"
              name="checkbox-trial"
            >
              {{ $t("statistics.trial_only") }}
            </b-form-checkbox>
            <b-form-checkbox
              id="checkbox-external"
              v-model="form.external"
              name="checkbox-external"
            >
              {{ $t("statistics.external") }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4" v-if="showExtraFields">
          <b-form-group
            id="input-group-result-greater"
            :label="$t('search.result_greater')"
            label-for="input-result-greater"
          >
            <b-form-input
              id="input-result-range"
              v-model="form.result_gte"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-result-less"
            :label="$t('search.result_less')"
            label-for="input-result-less"
          >
            <b-form-input
              id="input-result-less"
              v-model="form.result_lte"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4" v-if="showExtraFields">
          <b-form-group
            id="input-group-group-results"
            :label="$t('statistics.group_results')"
            label-for="input-group-results"
            :description="$t('statistics.group_results_description')"
          >
            <b-form-select
              id="input-group-results"
              v-model="form.group_results"
            >
              <option
                v-for="i in [
                  '',
                  '1',
                  '2',
                  '3',
                  '4',
                  '5',
                  '6',
                  '7',
                  '8',
                  '9',
                  '10'
                ]"
                :key="i"
                :value="i"
              >
                {{ i }}
              </option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4" v-if="showExtraFields">
          <b-form-group
            id="input-group-gender"
            :label="$t('statistics.gender')"
            label-for="input-gender"
          >
            <b-form-select id="input-gender" v-model="form.gender">
              <b-form-select-option value=""></b-form-select-option>
              <b-form-select-option value="M">{{
                $tc("statistics.man", 1)
              }}</b-form-select-option>
              <b-form-select-option value="W">{{
                $tc("statistics.woman", 1)
              }}</b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4">
          <b-form-group id="input-group-buttons" label-for="input-buttons">
            <b-button
              type="submit"
              variant="light"
              class="btn-orange space-right"
            >
              {{ $t("search.search") }}</b-button
            >
            <b-button type="reset" variant="danger">{{ $t("reset") }}</b-button
            ><br />
            <b-button
              variant="light"
              class="btn-orange space-right space-top"
              v-on:click="toggleExtraFields"
              :pressed="showExtraFields"
            >
              {{ $t("statistics.show_extras") }}
            </b-button>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <StatisticsLinksSave
      v-if="
        searchParameters && $store.state.user.is_staff && $store.state.editMode
      "
      :searchParameters="searchParameters"
    />
    <StatisticsResults
      v-if="searchParameters"
      :searchParameters="searchParameters"
    />
  </div>
</template>

<script>
/**
 * Display statistic search form
 */
import StatisticsLinksSave from "@/components/StatisticsLinksSave.vue";
import StatisticsResults from "@/components/StatisticsResults.vue";
import apiGet from "../mixins/ApiGet";

export default {
  name: "StatisticsForm",
  mixins: [apiGet],
  components: {
    StatisticsLinksSave,
    StatisticsResults
  },
  data() {
    return {
      categories: [],
      competitionLevels: [],
      competitionTypes: [],
      divisions: [],
      errors: {},
      form: {
        approved: false,
        category: [],
        competitionLevel: [],
        competitionType: [],
        date_end: null,
        date_start: null,
        division: [],
        group_results: "",
        max_results: 25,
        organization: [],
        trial: false,
        external: false,
        result_gte: null,
        result_lte: null,
        gender: ""
      },
      loadingSports: false,
      organizations: [],
      searchParameters: null,
      showExtraFields: false,
      sport: null,
      sports: []
    };
  },
  computed: {
    /**
     * Filter categories based on selected divisions
     *
     * @returns [{}]
     */
    filteredCategories: function () {
      if (this.form.division.length === 0) {
        return this.categories;
      }
      return this.categories.filter((category) => {
        return this.form.division.some(
          (division) => division === category.division
        );
      });
    }
  },
  watch: {
    /**
     * Select sport if only one is available
     */
    sports: {
      handler: function () {
        if (this.sports.length === 1) {
          this.selectSport(this.sports[0].id, false);
        }
      }
    }
  },
  mounted() {
    if (this.$route.query) {
      this.parseQueryParams();
    }
    this.getSports();
  },
  methods: {
    /**
     * Reset search form and push empty route
     */
    formReset() {
      this.form.category = [];
      this.form.competitionLevel = [];
      this.form.competitionType = [];
      this.form.organization = [];
      this.form.date_start = null;
      this.form.date_end = null;
      this.form.approved = false;
      this.form.trial = false;
      this.form.external = false;
      this.form.gender = "";
      this.form.max_results = 25;
      this.form.group_results = "";
      this.form.result_gte = null;
      this.form.result_lte = null;
      this.$router.push({ path: "search" }).catch((err) => {});
    },
    /**
     * Trigger form reset when pressing reset button
     *
     * @param evt
     */
    onReset(evt) {
      evt.preventDefault();
      this.formReset();
    },
    /**
     * Set search parameters and update router
     *
     * @param evt
     */
    onSubmit(evt) {
      if (evt) {
        evt.preventDefault();
      }
      let parameters = "?fields!=partial";
      let query = {};
      query.sport = this.sport;
      parameters += "&sport=" + this.sport;
      if (this.form.category.length) {
        parameters += "&category=" + this.form.category;
        query.category = this.form.category;
      }
      if (this.form.competitionLevel.length) {
        parameters += "&level=" + this.form.competitionLevel;
        query.level = this.form.competitionLevel;
      }
      if (this.form.competitionType.length) {
        parameters += "&type=" + this.form.competitionType;
        query.type = this.form.competitionType;
      }
      if (this.form.division.length) {
        parameters += "&division=" + this.form.division;
        query.division = this.form.division;
      }
      if (this.form.organization.length) {
        parameters += "&organization=" + this.form.organization;
        query.organization = this.form.organization;
      }
      if (this.form.date_start != null) {
        parameters += "&start=" + this.form.date_start;
        query.start = this.form.date_start;
      }
      if (this.form.date_end != null) {
        parameters += "&end=" + this.form.date_end;
        query.end = this.form.date_end;
      }
      if (this.form.max_results != null) {
        parameters += "&limit=" + this.form.max_results;
      }
      if (this.form.group_results !== "") {
        parameters += "&group_results=" + this.form.group_results;
        query.group_results = this.form.group_results;
      }
      if (this.form.approved) {
        parameters += "&approved=1";
        query.approved = 1;
      }
      if (this.form.trial) {
        parameters += "&trial=1";
        query.trial = 1;
      }
      if (this.form.external) {
        parameters += "&external=1";
        query.external = 1;
      }
      if (this.form.result_gte) {
        parameters += "&result_gte=" + this.form.result_gte.replace(",", ".");
        query.result_gte = this.form.result_gte.replace(",", ".");
      }
      if (this.form.result_lte) {
        parameters += "&result_lte=" + this.form.result_lte.replace(",", ".");
        query.result_gte = this.form.result_lte.replace(",", ".");
      }
      if (this.form.gender !== "") {
        parameters += "&gender=" + this.form.gender;
        query.gender = this.form.gender;
      }
      this.searchParameters = parameters;
      this.$router.push({ path: "search", query: query });
    },
    /**
     * Parse query parameters and set form values based on them
     */
    parseQueryParams() {
      if (this.$route.query.sport) {
        this.selectSport(this.$route.query.sport, false);
      }
      if (this.$route.query.category) {
        this.form.category = JSON.parse("[" + this.$route.query.category + "]");
      }
      if (this.$route.query.division) {
        this.form.division = JSON.parse("[" + this.$route.query.division + "]");
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
      if (this.$route.query.organization) {
        this.form.organization = JSON.parse(
          "[" + this.$route.query.organization + "]"
        );
        this.showExtraFields = true;
      }
      if (this.$route.query.approved) {
        this.form.approved = true;
        this.showExtraFields = true;
      }
      if (this.$route.query.trial) {
        this.form.trial = true;
        this.showExtraFields = true;
      }
      if (this.$route.query.external) {
        this.form.external = true;
        this.showExtraFields = true;
      }
      if (this.$route.query.group_results) {
        this.form.group_results = this.$route.query.group_results;
        this.showExtraFields = true;
      }
      if (this.$route.query.max_results) {
        this.form.max_results = this.$route.query.max_results;
      }
      if (this.$route.query.result_gte) {
        this.form.result_gte = this.$route.query.result_gte;
      }
      if (this.$route.query.result_lte) {
        this.form.result_lte = this.$route.query.result_lte;
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
      if (this.$route.query.gender) {
        this.form.gender = this.$route.query.gender;
        this.showExtraFields = true;
      }
      if (this.$route.query.load) {
        this.onSubmit();
      }
    },
    /**
     * Select sport and trigger API calls
     *
     * @param {number} id
     * @param {boolean} reset - option to reset form, defaults to true
     */
    selectSport(id, reset = true) {
      this.$set(this.errors, "main", null);
      this.sport = id;
      this.getCategories(this.sport);
      this.getDivisions(this.sport);
      this.getCompetitionLevels();
      this.getCompetitionTypes(this.sport);
      this.getOrganizations(false, false);
      if (reset) {
        this.formReset();
      }
    },
    /**
     * Set current year start and end to form data
     */
    setCurrentYear() {
      this.form.date_start = new Date().getFullYear() + "-01-01";
      this.form.date_end = new Date().getFullYear() + "-12-31";
    },
    /**
     * Toggle showing extra fields
     */
    toggleExtraFields() {
      this.showExtraFields = !this.showExtraFields;
    }
  }
};
</script>

<style scoped></style>
