<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ athlete.first_name }} {{ athlete.last_name }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">{{ $t("athlete.info") }}</h2>
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
    <b-row v-if="loading">
      <b-col>
        <b-spinner label="Loading..."></b-spinner>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("first_name") }}</dt>
          <dd v-if="athlete.first_name">{{ athlete.first_name }}</dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("last_name") }}</dt>
          <dd v-if="athlete.last_name">{{ athlete.last_name }}</dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("athlete.sport_id") }}</dt>
          <dd v-if="athlete.sport_id">{{ athlete.sport_id }}</dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("athlete.club") }}</dt>
          <dd v-if="athlete.organization_info">
            {{ athlete.organization_info.name }}
          </dd>
        </dl>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Displays basic information for a single athlete
 */
import { HTTP } from "../api/BaseApi.js";
import errorParser from "../utils/ErrorParser";

export default {
  name: "athlete",
  data() {
    return {
      athlete: {},
      errors: {},
      loading: true
    };
  },
  mounted() {
    this.getAthlete(this.$route.params.athlete_id);
  },
  methods: {
    /**
     * Fetch athlete information from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getAthlete(id) {
      this.$set(this.errors, "main", null);
      this.athlete = {};
      this.loading = true;
      HTTP.get("athletes/" + id + "/")
        .then(response => {
          this.athlete = response.data || {};
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
