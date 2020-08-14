<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $tc("record.record", 2) }}</h1>
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
        <h2 class="bg-sal-orange">{{ $t("record.search") }}</h2>
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
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectSport(sport.id)"
        >
          {{ sport.name }}
        </b-button>
      </b-col>
    </b-row>
    <b-row v-if="$store.state.user.is_staff">
      <b-col>
        <b-button
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="showUnapproved"
        >
          {{ $t("record.unapproved") }}
        </b-button>
      </b-col>
    </b-row>
    <b-form @submit="onSubmit" @reset="onReset" v-if="showForm">
      <b-row>
        <b-col cols="12" md="6" xl="4">
          <b-form-group
            id="input-group-record-level"
            label-for="input-record-level"
            :label="$t('record.choose_level')"
          >
            <b-form-select
              id="input-record-level"
              v-model="form.record_level"
              :options="recordLevels"
              textField="name"
              valueField="id"
              required
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4">
          <b-form-group
            id="input-group-categories"
            :label="$t('result.category')"
            label-for="input-categories"
            :description="$t('statistics.choose_multiple')"
          >
            <b-form-select
              id="input-categories"
              v-model="form.category"
              :options="categories"
              textField="name"
              valueField="id"
              multiple
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4">
          <b-form-group
            id="input-group-competition-types"
            :label="$t('competition.type')"
            label-for="input-competition-types"
            :description="$t('statistics.choose_multiple')"
          >
            <b-form-select
              id="input-competition-types"
              v-model="form.competitionType"
              :options="competitionTypes"
              textField="name"
              valueField="id"
              multiple
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4">
          <b-form-group id="input-group-checkboxes">
            <b-form-checkbox
              id="checkbox-approved"
              v-model="form.approved"
              name="checkbox-approved"
            >
              {{ $t("record.include_approved") }}
            </b-form-checkbox>
            <b-form-checkbox
              id="checkbox-preliminary"
              v-model="form.preliminary"
              name="checkbox-preliminary"
            >
              {{ $t("record.include_preliminary") }}
            </b-form-checkbox>
            <b-form-checkbox
              id="checkbox-historical"
              v-model="form.historical"
              name="checkbox-historical"
            >
              {{ $t("record.include_historical") }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6" xl="4">
          <b-button
            type="submit"
            variant="light"
            class="btn-orange space-right"
          >
            {{ $t("search.search") }}</b-button
          >
          <b-button type="reset" variant="danger">{{ $t("reset") }}</b-button
          ><br /><br />
        </b-col>
      </b-row>
    </b-form>
    <RecordsResults
      v-if="searchParameters"
      :searchParameters="searchParameters"
    />
  </div>
</template>

<script>
/**
 * Records search form
 */
import { HTTP } from "../api/BaseApi.js";
import RecordsResults from "@/components/RecordsResults.vue";
import errorParser from "../utils/ErrorParser";
import apiGet from "../mixins/ApiGet";

export default {
  name: "StatisticsForm",
  mixins: [apiGet],
  components: {
    RecordsResults
  },
  data() {
    return {
      categories: [],
      competitionTypes: [],
      errors: {},
      form: {
        approved: true,
        category: [],
        competitionType: [],
        historical: false,
        preliminary: true,
        record_level: null
      },
      loadingSports: false,
      recordLevels: [],
      sport: null,
      sports: [],
      searchParameters: null,
      showForm: false
    };
  },

  mounted() {
    if (this.$route.query) {
      this.parseQueryParams();
    }
    this.getSports();
    this.getRecordLevels();
  },
  methods: {
    /**
     * Resets form information
     */
    formReset() {
      this.form = {
        approved: true,
        category: [],
        competitionType: [],
        historical: false,
        preliminary: true,
        record_level: null
      };
      this.setRecordLevel();
      this.searchParameters = null;
      this.$router.push({ path: "records" }, () => {});
    },
    /**
     * Fetch record levels from API
     *
     * @returns {Promise<void>}
     */
    async getRecordLevels() {
      HTTP.get("recordlevels/")
        .then(response => {
          this.recordLevels = response.data.results;
          this.setRecordLevel();
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Trigger form reset on button call
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
      let parameters = "?sport=" + this.sport;
      let query = {};
      query.sport = this.sport;
      if (this.form.record_level) {
        parameters += "&level=" + this.form.record_level;
        query.level = this.form.record_level;
      }
      if (this.form.category.length) {
        parameters += "&category=" + this.form.category;
        query.category = this.form.category;
      }
      if (this.form.competitionType.length) {
        parameters += "&type=" + this.form.competitionType;
        query.type = this.form.competitionType;
      }
      if (this.form.approved && !this.form.preliminary) {
        parameters += "&approved=1";
      } else if (!this.form.approved && this.form.preliminary) {
        parameters += "&approved=0";
      }
      if (!this.form.historical) {
        parameters += "&historical=0";
      }
      if (!this.form.approved) {
        query.approved = 0;
      }
      if (!this.form.preliminary) {
        query.preliminary = 0;
      }
      if (this.form.historical) {
        query.historical = 1;
      }
      this.searchParameters = parameters;
      this.$router.push({ path: "records", query: query }, () => {});
    },
    /**
     * Parses query parameters ans sets form information based on them
     */
    parseQueryParams() {
      if (this.$route.query.sport) {
        this.selectSport(this.$route.query.sport, false);
      }
      if (this.$route.query.category) {
        this.form.category = JSON.parse("[" + this.$route.query.category + "]");
      }
      if (this.$route.query.type) {
        this.form.competitionType = JSON.parse(
          "[" + this.$route.query.type + "]"
        );
      }
      if (this.$route.query.level) {
        this.form.record_level = this.$route.query.level;
      }
      if (this.$route.query.approved === "0") {
        this.form.approved = false;
      }
      if (this.$route.query.preliminary === "0") {
        this.form.preliminary = false;
      }
      if (this.$route.query.historical) {
        this.form.historical = true;
      }
      if (this.$route.query.load) {
        this.onSubmit();
      }
    },
    /**
     * Select sport and trigger sport related API calls
     *
     * @param {number} id
     * @param {boolean} reset - trigger form reset, defaults to true
     */
    selectSport(id, reset = true) {
      this.$set(this.errors, "main", null);
      this.sport = id;
      this.getCategories(id);
      this.getCompetitionTypes(id);
      this.showForm = true;
      if (reset) {
        this.formReset();
      }
    },
    /**
     * Set selected record level to "SE" if it exists
     */
    setRecordLevel() {
      if (this.recordLevels.length > 0 && !this.form.record_level) {
        const selectedOption = this.recordLevels.filter(
          level => level.abbreviation === "SE"
        )[0];
        if (selectedOption) {
          this.$set(this.form, "record_level", selectedOption.id);
        } else {
          this.$set(this.form, "record_level", this.recordLevels[0].id);
        }
      }
    },
    /**
     * Show all unapproved records
     * - Option listed for admins
     */
    showUnapproved() {
      this.searchParameters = "?approved=0";
      this.$router.push({ path: "records", query: { approved: 0 } });
    }
  }
};
</script>

<style scoped></style>
