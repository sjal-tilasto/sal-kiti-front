<template>
  <div v-if="competition">
    <b-row>
      <b-col>
        <h1>
          {{ $t("result.import") }}
        </h1>
        <h2 class="bg-sal-orange">
          {{ competition.organization }}: {{ competition.date }}
        </h2>
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
        <b-form @submit="onSubmitFile">
          <b-form-group
            id="input-group-file"
            label-for="input-file"
            :description="$t('import.file.select_or_drop')"
          >
            <b-form-file
              v-model="form.file"
              :state="Boolean(form.file)"
              :placeholder="$t('import.file.select')"
              :drop-placeholder="$t('import.file.drop')"
              required
            >
            </b-form-file>
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
    <b-row v-if="results.length > 0">
      <b-col>
        <p>{{ $t("search.count") }}: {{ results.length }}</p>
        <b-table small :items="results" :fields="importFields" ref="table">
          <template v-slot:cell(error)="data">
            <ul>
              <li v-for="(e, index) in data.item.error" v-bind:key="index">
                {{ e }}
              </li>
            </ul>
          </template>
          <template v-slot:cell(warning)="data">
            <ul>
              <li v-for="(e, index) in data.item.warning" v-bind:key="index">
                {{ e }}
              </li>
            </ul>
          </template>
          <template v-slot:cell(result)="data">
            <div v-if="data.item.result_code">
              {{ data.item.result_code }}
              <div v-if="data.item.result">({{ data.item.result }})</div>
            </div>
            <div v-else>{{ data.item.result }}</div>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          v-if="finished"
          :to="{
            name: 'divari-competition',
            params: {
              competition_id: competition.id
            }
          }"
          variant="light"
          class="btn-orange"
          >{{ $t("import.show_results") }}
        </b-button>
        <b-button
          v-if="finished"
          variant="outline-info"
          v-on:click="getDebugExcel()"
          class="space-right float-right"
        >
          {{ $t("import.debug_excel") }}
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Import results from various sources
 */
import { HTTP } from "../api/BaseApi.js";
import * as XLSX from "xlsx";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";

export default {
  name: "DivariImportResults",
  data() {
    return {
      competition: null,
      competitionResults: [],
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      debugResults: null,
      errors: [],
      finished: false,
      form: {
        file: null
      },
      results: [],
      reader: null,
      result: {},
      seasons: []
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
        { key: "athlete", label: this.$tc("athlete.athlete", 1) },
        { key: "bow", label: this.$t("sjal.divari.bow_type") },
        { key: "target", label: this.$t("sjal.divari.target_type") },
        { key: "result", label: this.$tc("result.result", 1) },
        { key: "warning", label: this.$t("import.warning.label") },
        { key: "error", label: this.$t("import.error.label") }
      ];
    }
  },
  mounted() {
    this.getCompetition(this.$route.params.competition_id);
    this.getResults(this.$route.params.competition_id);
    this.getSeasons();
  },
  methods: {
    /**
     * Calculate season results
     *
     * @returns {Promise<void>}
     */
    calculateSeasonResults(season_id) {
      let data = {
        season: season_id
      };
      HTTP.post("divari/calculate", data, this.config)
        .then((response) => {
          return response.data.results;
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Clean variables between results
     */
    cleanVariables() {
      this.result = {
        competition: this.competition.id,
        athlete: null,
        result: null,
        bow_type: null,
        target_type: null
      };
    },
    /**
     * Fetch competition from API
     * @returns {Promise<void>}
     */
    async getCompetition(competition_id) {
      this.loading = true;
      this.competition = null;
      this.$set(this.errors, "main", null);
      HTTP.get("divari/competitions/" + competition_id + "/")
        .then((response) => {
          this.competition = response.data || {};
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loading = false));
    },
    /**
     * Create a debug xlsx file from import information and upload it to user
     */
    getDebugExcel() {
      if (this.debugResults) {
        this.debugResults.forEach((row) => {
          if (row["error"].length > 0) {
            row["error"] = row["error"].toString();
          }
          if (row["warning"].length > 0) {
            row["warning"] = row["warning"].toString();
          }
        });
        let worksheet = XLSX.utils.json_to_sheet(this.debugResults);
        let workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "debug");
        XLSX.writeFile(workbook, "debug.xlsx");
      }
    },
    /**
     * Fetch results from API
     *
     * @returns {Promise<void>}
     */
    async getResults(competition_id) {
      this.loading = true;
      this.competitionResults = [];
      this.$set(this.errors, "main", null);
      let parameters = "?competition=" + competition_id;
      HTTP.get("divari/results/" + parameters)
        .then((response) => {
          this.competitionResults = response.data.results || [];
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loading = false));
    },
    /**
     * Fetch seasons from API
     *
     * @returns {Promise<void>}
     */
    async getSeasons() {
      HTTP.get("divari/seasons/?ordering=-date_start")
        .then((response) => {
          this.seasons = response.data.results;
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Check submitted file type and trigger correct parser
     *
     * @param event
     * @returns {Promise<void>}
     */
    async onSubmitFile(event) {
      event.stopPropagation();
      event.preventDefault();
      try {
        let file = this.form.file;
        let resultData = [];
        if (
          file &&
          file.name &&
          (file.name.toLowerCase().endsWith(".csv") ||
            file.name.toLowerCase().endsWith(".xls") ||
            file.name.toLowerCase().endsWith(".xlsx") ||
            file.name.toLowerCase().endsWith(".ods"))
        ) {
          resultData = await this.parseExcel(file);
          this.results = resultData;
          await this.parseResults();
        } else {
          this.$set(this.errors, "main", [
            this.$t("import.error.unknown_file_type_excel")
          ]);
        }
      } catch (error) {
        this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
      }
    },
    /**
     * Read xls file
     *
     * @param file
     * @returns {Promise<unknown>}
     */
    parseExcel(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (e) => {
          let data = new Uint8Array(e.target.result);
          let workbook = XLSX.read(data, { type: "array" });
          let firstSheetName = workbook.SheetNames[0];
          let worksheet = workbook.Sheets[firstSheetName];
          resolve(XLSX.utils.sheet_to_json(worksheet));
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    },
    /**
     * Parse result information from results array
     */
    async parseResults() {
      for (let i = 0; i < this.results.length; i++) {
        Object.keys(this.results[i]).map(
          (k) =>
            (this.results[i][k] =
              typeof this.results[i][k] == "string"
                ? this.results[i][k].trim()
                : this.results[i][k])
        );
        this.results[i].error = [];
        this.results[i].warning = [];
        this.results[i].status = this.$t("import.status.pending");
        this.cleanVariables();
        if (
          "athlete" in this.results[i] &&
          this.results[i].athlete.length > 0
        ) {
          this.result.athlete = this.results[i].athlete;
        } else {
          this.results[i].error.push(
            this.$t("sjal.divari.import.error.missing_athlete")
          );
        }
        if ("bow" in this.results[i] && this.results[i]["bow"].length > 0) {
          if (
            ["recurve", "tähtäin"].includes(
              this.results[i]["bow"].toLowerCase()
            )
          ) {
            this.result.bow_type = "recurve";
          } else if (
            ["compound", "talja"].includes(this.results[i]["bow"].toLowerCase())
          ) {
            this.result.bow_type = "compound";
          } else if (
            ["barebow", "vaisto"].includes(this.results[i]["bow"].toLowerCase())
          ) {
            this.result.bow_type = "barebow";
          } else if (
            ["longbow", "pitkäjousi"].includes(
              this.results[i]["bow"].toLowerCase()
            )
          ) {
            this.result.bow_type = "longbow";
          } else {
            this.results[i].error.push(
              this.$t("sjal.divari.import.error.incorrect_bow")
            );
          }
        } else {
          this.results[i].error.push(
            this.$t("sjal.divari.import.error.missing_bow")
          );
        }
        if ("target" in this.results[i]) {
          if (!isNaN(this.results[i]["target"])) {
            this.results[i]["target"] = this.results[i]["target"].toString();
          }
          if (this.results[i]["target"].includes("40")) {
            this.result.target_type = 40;
          } else if (this.results[i]["target"].includes("60")) {
            this.result.target_type = 60;
          } else if (this.results[i]["target"].includes("80")) {
            this.result.target_type = 80;
          } else if (this.results[i]["target"].includes("122")) {
            this.result.target_type = 122;
          } else {
            this.results[i].error.push(
              this.$t("sjal.divari.import.error.incorrect_target")
            );
          }
        } else {
          this.results[i].error.push(
            this.$t("sjal.divari.import.error.missing_target")
          );
        }
        if ("result" in this.results[i]) {
          let result = this.results[i]["result"];
          if (
            Number.isInteger(result) &&
            parseInt(result) >= 0 &&
            parseInt(result) <= 720
          ) {
            this.result.result = parseInt(result);
          } else {
            this.results[i].error.push(
              this.$t("sjal.divari.import.error.incorrect_result")
            );
          }
        } else {
          this.results[i].error.push(
            this.$t("sjal.divari.import.error.missing_result")
          );
        }
        if (this.results[i].error.length === 0) {
          await this.postResult(i);
        }
        if (this.results[i].error.length === 0) {
          this.results[i].status = this.$t("import.status.success");
        } else {
          this.results[i].status = this.$t("import.status.failure");
        }
        this.$refs.table.refresh();
      }
      this.debugResults = this.results;
      await this.getResults(this.$route.params.competition_id);
      let competitionDate = Date.parse(this.competition.date);
      this.seasons.forEach((season) => {
        let seasonStart = Date.parse(season.date_start);
        let seasonEnd = Date.parse(season.date_end);
        if (competitionDate >= seasonStart && competitionDate <= seasonEnd) {
          this.calculateSeasonResults(season.id);
        }
      });
      this.finished = true;
    },
    /**
     * Create a new result
     *
     * @returns {Promise<void>}
     */
    async postResult(i) {
      let duplicate = this.competitionResults.filter(
        (res) =>
          res.athlete === this.result.athlete &&
          res.target_type === this.result.target_type.toString() &&
          res.bow_type === this.result.bow_type
      );
      if (duplicate.length > 1) {
        this.results[i].error.push(this.$t("import.error.result_duplicate"));
      }
      if (duplicate.length === 1 && this.results[i].error.length === 0) {
        await HTTP.put(
          "divari/results/" + duplicate[0].id + "/",
          this.result,
          this.config
        )
          .then((response) => {
            this.results[i].response = response.data;
          })
          .catch((error) => {
            this.results[i].error.push(...errorParser.result.bind(this)(error));
          });
      } else if (this.results[i].error.length === 0) {
        await HTTP.post("divari/results/", this.result, this.config)
          .then((response) => {
            this.results[i].response = response.data;
          })
          .catch((error) => {
            this.results[i].error.push(...errorParser.result.bind(this)(error));
          });
      }
    }
  }
};
</script>

<style scoped></style>
