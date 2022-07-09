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
    <b-row>
      <b-col>
        <b-form @submit="onSubmit">
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
          </b-form-group>
          <b-form-group
            id="input-group-date"
            :label="$t('date')"
            label-for="input-date"
          >
            <b-form-input
              id="input-date"
              v-model="form.date"
              type="date"
              required
            ></b-form-input>
          </b-form-group>
          <b-button
            type="submit"
            variant="light"
            class="btn-orange space-right"
            >{{ $t("submit") }}</b-button
          >
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Import results from various sources
 */
import { HTTP } from "../api/BaseApi.js";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";
import apiGet from "../mixins/ApiGet";

export default {
  name: "DivariCompetitionForm",
  mixins: [apiGet],
  data() {
    return {
      competition: null,
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      errors: [],
      finished: false,
      form: {
        date: null,
        organization: null
      },
      organizations: []
    };
  },
  mounted() {
    this.getOrganizations(true, false, true);
  },
  methods: {
    /**
     * Create a competition
     *
     * @param event
     * @returns {Promise<void>}
     */
    async onSubmit(event) {
      event.stopPropagation();
      event.preventDefault();
      await this.postCompetition();
    },
    /**
     * Create a new competition
     *
     * @returns {Promise<void>}
     */
    async postCompetition() {
      this.$set(this.errors, "main", null);
      let organization = this.organizations.find(
        (item) => item.id === this.form.organization
      );
      let data = {
        organization: organization.name,
        date: this.form.date
      };
      HTTP.post("divari/competitions/", data, this.config)
        .then((response) => {
          this.$router.push({
            name: "divari-import",
            params: { competition_id: response.data.id }
          });
        })
        .catch((error) => {
          if (error.response.status === 400) {
            this.$set(this.errors, "main", [
              this.$t("sjal.divari.competition_exists")
            ]);
          } else {
            this.$set(
              this.errors,
              "main",
              errorParser.generic.bind(this)(error)
            );
          }
        });
    }
  }
};
</script>

<style scoped></style>
