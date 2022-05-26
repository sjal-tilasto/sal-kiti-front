<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t("info.tools") }}</h1>
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
        <h2 class="bg-sal-orange">{{ $tc("tools.athlete_check", 2) }}</h2>
        <b-form @submit="onSubmit">
          <b-form-group
            id="input-group-description"
            :label="$t('tools.sport_id_list')"
            label-for="input-description"
          >
            <b-form-textarea
              id="input-description"
              v-model="form.sport_id_list"
              rows="10"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>
          <b-form-group
            id="input-group-date"
            :label="$t('tools.licence_date')"
            label-for="input-date"
          >
            <b-form-input
              id="input-date-start"
              v-model="form.date"
              type="date"
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
    <b-row>
      <b-col>
        <p>{{ $t("search.count") }}: {{ athletes.length }}</p>
        <b-table small :items="athletes" :fields="importFields" ref="table">
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          v-if="athletes.length > 0"
          variant="outline-info"
          v-on:click="getExcel()"
          class="space-right float-right"
        >
          {{ $t("tools.download_excel") }}
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Import athletes
 */
import { HTTP } from "../api/BaseApi.js";
import * as XLSX from "xlsx";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";
import apiGet from "../mixins/ApiGet";

export default {
  name: "AthleteCheck",
  mixins: [apiGet],
  data() {
    return {
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      debugResults: null,
      errors: [],
      form: {
        sport_id_list: "",
        date: null
      },
      finished: false,
      headers: [],
      athlete: {},
      athletes: [],
      results: [],
      reader: null
    };
  },
  computed: {
    /**
     * Sets table fields for import status
     *
     * @returns {array} fields
     */
    importFields: function () {
      return [
        { key: "status", label: this.$t("import.status.label") },
        { key: "sport_id", label: this.$t("athlete.sport_id") },
        { key: "first_name", label: this.$t("first_name") },
        { key: "last_name", label: this.$t("last_name") },
        { key: "organization", label: this.$t("organization") },
        { key: "licence", label: this.$t("licence") },
        { key: "warning", label: this.$t("import.warning.label") },
        { key: "error", label: this.$t("import.error.label") }
      ];
    }
  },
  methods: {
    /**
     * Search for the athlete and update information
     */
    async getAthletes(searchParams, i) {
      this.loadingAthletes = true;
      HTTP.get("athletes/" + searchParams)
        .then((response) => {
          if (response.data.count === 0) {
            this.athletes[i]["error"] = this.$t(
              "tools.warning.no_athletes_found"
            );
            this.athletes[i].status = "Error";
          } else if (response.data.count > 1) {
            this.athletes[i]["error"] = this.$t(
              "tools.warning.multiple_athletes_found"
            );
            this.athletes[i].status = "Error";
          } else {
            this.athletes[i].first_name = response.data.results[0].first_name;
            this.athletes[i].last_name = response.data.results[0].last_name;
            this.athletes[i].organization =
              response.data.results[0].organization_info.abbreviation;
            if (this.form.date && "info" in response.data.results[0]) {
              this.athletes[i].licence = response.data.results[0]["info"]
                .filter(
                  (info) =>
                    info.date_start <= this.form.date &&
                    info.date_end >= this.form.date &&
                    info.type === "licence"
                )
                .map((filtered) => filtered.value)
                .toString();
            }
            if (this.form.date && !this.athletes[i].licence) {
              this.athletes[i]["warning"] = this.$t(
                "tools.warning.licence_missing"
              );
            }
            this.athletes[i].status = "Updated";
            this.$refs.table.refresh();
          }
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingAthletes = false));
    },
    /**
     * Create a xlsx file from information and upload it to user
     */
    getExcel() {
      if (this.athletes) {
        let worksheet = XLSX.utils.json_to_sheet(this.athletes);
        let workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "info");
        XLSX.writeFile(workbook, "athlete_check.xlsx");
      }
    },
    parseAthletes: async function () {
      let sportIdList = this.form.sport_id_list.split("\n");
      this.athletes = Array.from(sportIdList, (s) => {
        return { sport_id: s };
      });
      for (let i = 0; i < this.athletes.length; i++) {
        if (this.athletes[i].sport_id) {
          this.athletes[i].status = "Updating...";
          await this.getAthletes("?sport_id=" + this.athletes[i].sport_id, i);
        }
      }
    },
    /**
     * Check athlete information
     *
     * @param evt
     */
    onSubmit(evt) {
      evt.preventDefault();
      this.parseAthletes();
    }
  }
};
</script>

<style scoped></style>
