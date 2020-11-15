<template>
  <div>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange" v-if="edit">{{ $t("competition.edit") }}</h2>
        <h2 class="bg-sal-orange" v-else>{{ $t("competition.add") }}</h2>
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
        <b-form @submit="onSubmit">
          <b-form-group
            id="input-group-name"
            :label="$t('name')"
            label-for="input-name"
          >
            <b-form-input
              id="input-name"
              v-model="form.name"
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="!'name' in errors">
              <ul>
                <li v-for="e in errors.name" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-description"
            :label="$t('description')"
            label-for="input-description"
          >
            <b-form-textarea
              id="input-description"
              v-model="form.description"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
            <b-form-invalid-feedback :state="!'description' in errors">
              <ul>
                <li v-for="e in errors.description" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-location"
            :label="$t('location')"
            label-for="input-location"
          >
            <b-form-input
              id="input-location"
              v-model="form.location"
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="!'location' in errors">
              <ul>
                <li v-for="e in errors.location" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-date-start"
            :label="$t('date_start')"
            label-for="input-date-start"
          >
            <b-form-input
              id="input-date-start"
              v-model="form.date_start"
              type="date"
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="!'date_start' in errors">
              <ul>
                <li v-for="e in errors.date_start" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-date-end"
            :label="$t('date_end')"
            label-for="input-date-end"
          >
            <b-form-input
              id="date-end"
              v-model="form.date_end"
              type="date"
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="!'date_end' in errors">
              <ul>
                <li v-for="e in errors.date_end" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-organization"
            :label="$t('organizer')"
            label-for="input-organization"
          >
            <b-form-select
              id="input-organization"
              v-model="form.organization"
              :options="organizations"
              textField="name"
              valueField="id"
              required
            >
            </b-form-select>
            <b-form-invalid-feedback :state="!'organization' in errors">
              <ul>
                <li v-for="e in errors.organization" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-sports"
            label-for="input-sports"
            :label="$t('statistics.choose_sport')"
          >
            <b-form-select
              id="input-sports"
              v-model="sport"
              :options="sports"
              textField="name"
              valueField="id"
              v-on:change="selectSport"
            >
            </b-form-select>
          </b-form-group>
          <b-form-group
            id="input-group-competition-types"
            :label="$t('competition.type')"
            label-for="input-competition-types"
          >
            <b-form-select
              id="input-competition-types"
              v-model="form.type"
              :options="competitionTypes"
              textField="name"
              valueField="id"
              required
            >
            </b-form-select>
            <b-form-invalid-feedback :state="!'type' in errors">
              <ul>
                <li v-for="e in errors.type" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-competition-levels"
            :label="$t('competition.level')"
            label-for="input-competition-levels"
          >
            <b-form-select
              id="input-competition-levels"
              v-model="form.level"
              :options="competitionLevels"
              textField="name"
              valueField="id"
              required
            >
            </b-form-select>
            <b-form-invalid-feedback :state="!'level' in errors">
              <ul>
                <li v-for="e in errors.level" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-button
            type="submit"
            variant="light"
            class="btn-orange space-right"
          >
            <section v-if="edit">{{ $t("update") }}</section>
            <section v-else>{{ $t("create") }}</section>
          </b-button>
          <br />
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Competition create and edit form
 */
import { HTTP } from "../api/BaseApi.js";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";
import apiGet from "../mixins/ApiGet";

export default {
  name: "CompetitionForm",
  mixins: [apiGet],
  data() {
    return {
      competition: {},
      competitionLevels: [],
      competitionTypes: [],
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      edit: false,
      errors: {},
      event: {},
      form: {
        date_start: null,
        date_end: null,
        event: this.$route.params.event_id,
        level: null,
        location: null,
        name: null,
        description: "",
        organization: null,
        type: null
      },
      organizations: [],
      sports: [],
      sport: null
    };
  },
  mounted() {
    this.getOrganizations(true, false, true);
    this.getSports();
    this.getCompetitionLevels();
    this.getEvent(this.$route.params.event_id);
    if (this.$route.params.competition_id) {
      this.edit = true;
      this.getCompetition(this.$route.params.competition_id);
    }
  },
  methods: {
    /**
     * Fetch competition information from API and set sport
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getCompetition(id) {
      this.event = {};
      HTTP.get("competitions/" + id + "/")
        .then(response => {
          this.form = response.data || {};
          if (
            "data" in response &&
            "type_info" in response.data &&
            "sport" in response.data.type_info
          ) {
            this.selectSport(response.data.type_info.sport);
          }
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch event information from API and set form values based on it
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getEvent(id) {
      this.event = {};
      HTTP.get("events/" + id + "/")
        .then(response => {
          this.event = response.data || {};
          if (!this.form.name) {
            this.form.name = response.data.name;
          }
          if (!this.form.description) {
            this.form.description = response.data.description;
          }
          if (!this.form.location) {
            this.form.location = response.data.location;
          }
          if (!this.form.date_start) {
            this.form.date_start = response.data.date_start;
          }
          if (!this.form.date_end) {
            this.form.date_end = response.data.date_end;
          }
          if (!this.form.organization) {
            this.form.organization = response.data.organization;
          }
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Create or edit competition
     *
     * @param evt
     */
    onSubmit(evt) {
      evt.preventDefault();
      if (this.$route.params.competition_id) {
        this.putCompetition(this.$route.params.competition_id);
      } else {
        this.postCompetition();
      }
    },
    /**
     * Create a new competition
     *
     * @returns {Promise<void>}
     */
    async postCompetition() {
      this.erros = {};
      this.form.layout = this.competitionTypes.find(
        obj => obj.id === this.form.type
      ).layout;
      HTTP.post("competitions/", this.form, this.config)
        .then(response => {
          this.$router.push({
            name: "competition",
            params: { competition_id: response.data.id }
          });
        })
        .catch(error => {
          this.errors = errorParser.form.bind(this)(error);
        });
    },
    /**
     * Edit the competition
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async putCompetition(id) {
      this.erros = {};
      HTTP.put("competitions/" + id + "/", this.form, this.config)
        .then(response => {
          this.$router.push({
            name: "competition",
            params: { competition_id: response.data.id }
          });
        })
        .catch(error => {
          this.errors = errorParser.form.bind(this)(error);
        });
    },
    /**
     * Set sport and fetch competition types based on it
     *
     * @param {number} sport
     */
    selectSport(sport = null) {
      if (sport) {
        this.sport = sport;
      }
      if (this.sport) {
        this.getCompetitionTypes(this.sport);
      }
    }
  }
};
</script>

<style scoped></style>
