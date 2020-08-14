<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t("info.management") }}</h1>
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
        <h2 class="bg-sal-orange">{{ $tc("athlete.import", 2) }}</h2>
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
    <b-row>
      <b-col>
        <p>{{ $t("search.count") }}: {{ athletes.length }}</p>
        <b-table small :items="athletes" :fields="importFields" ref="table">
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
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
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
 * Import athletes
 */
import { HTTP } from "../api/BaseApi.js";
import XLSX from "xlsx";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";
import apiGet from "../mixins/ApiGet";

export default {
  name: "AthleteImport",
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
      form: {},
      finished: false,
      headers: [],
      athlete: {},
      athletes: [],
      reader: null
    };
  },
  computed: {
    /**
     * Sets table fields for import status
     *
     * @returns {array} fields
     */
    importFields: function() {
      return [
        { key: "status", label: this.$t("import.status.label") },
        { key: "sport_id", label: this.$t("athlete.sport_id") },
        { key: "first_name", label: this.$t("first_name") },
        { key: "last_name", label: this.$t("last_name") },
        { key: "organization", label: this.$t("organization") },
        { key: "gender", label: this.$t("gender") },
        { key: "date_of_birth", label: this.$t("date_of_birth") },
        { key: "warning", label: this.$t("import.warning.label") },
        { key: "error", label: this.$t("import.error.label") }
      ];
    }
  },
  mounted() {
    this.getOrganizations();
  },
  methods: {
    /**
     * Clean variables between athletes
     */
    cleanVariables() {
      this.athlete = {
        sport_id: null,
        first_name: null,
        last_name: null,
        organization: null,
        gender: null,
        date_of_birth: null
      };
    },
    /**
     * Create a debug xlsx file from import information and upload it to user
     */
    getDebugExcel() {
      if (this.debugResults) {
        this.debugResults.forEach(row => {
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
     * Check submitted file type and trigger parser
     *
     * @param event
     * @returns {Promise<void>}
     */
    async onSubmitFile(event) {
      event.stopPropagation();
      event.preventDefault();
      try {
        let file = this.form.file;
        let athleteData = [];
        if (
          file &&
          file.type &&
          (file.type === "application/vnd.oasis.opendocument.spreadsheet" ||
            file.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        ) {
          athleteData = await this.parseExcel(file);
          this.athletes = athleteData;
          this.parseAthletes();
        } else {
          this.$set(this.errors, "main", [
            this.$t("import.error.unknown_file_type")
          ]);
        }
      } catch (error) {
        this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
      }
    },
    /**
     * Parse athlete information from athletes array
     */
    async parseAthletes() {
      let dateRegexCheck = /^\d{4}-\d{2}-\d{2}$/;
      for (let i = 0; i < this.athletes.length; i++) {
        this.athletes[i].error = [];
        this.athletes[i].warning = [];
        this.athletes[i].status = this.$t("import.status.pending");
        this.cleanVariables();
        if ("sport_id" in this.athletes[i]) {
          if (this.athletes[i].sport_id.length > 15) {
            this.athletes[i].error.push(
              this.$t("import.error.missing_sport_id")
            );
          } else {
            this.athlete.sport_id = this.athletes[i].sport_id;
          }
        } else {
          this.athletes[i].error.push(this.$t("import.error.missing_sport_id"));
        }
        if ("first_name" in this.athletes[i]) {
          this.athlete.first_name = this.athletes[i].first_name;
        } else {
          this.athletes[i].error.push(
            this.$t("import.error.missing_first_name")
          );
        }
        if ("last_name" in this.athletes[i]) {
          this.athlete.last_name = this.athletes[i].last_name;
        } else {
          this.athletes[i].error.push(
            this.$t("import.error.missing_last_name")
          );
        }
        if ("gender" in this.athletes[i]) {
          if (["M", "W", "U", "O"].includes(this.athletes[i].gender)) {
            this.athlete.gender = this.athletes[i].gender;
          } else {
            this.athletes[i].error.push(
              this.$t("import.error.incorrect_gender")
            );
          }
        } else {
          this.athletes[i].error.push(this.$t("import.error.missing_gender"));
        }
        if ("date_of_birth" in this.athletes[i]) {
          if (this.athletes[i].date_of_birth.toString().match(dateRegexCheck)) {
            this.athlete.date_of_birth = this.athletes[i].date_of_birth;
          } else {
            this.athletes[i].error.push(
              this.$t("import.error.incorrect_date_of_birth")
            );
          }
        } else {
          this.athletes[i].warning.push(
            this.$t("import.error.missing_date_of_birth")
          );
        }
        if ("organization" in this.athletes[i]) {
          let organization = this.organizations.filter(
            org => org.abbreviation === this.athletes[i].organization
          );
          if (organization.length === 0) {
            organization = this.organizations.filter(
              org => org.name === this.athletes[i].organization
            );
          }
          if (organization.length === 1) {
            this.athlete.organization = organization[0].id;
          } else if (organization.length > 1) {
            this.athletes[i].error.push(
              this.$t("import.error.organization_multiple")
            );
          } else {
            this.athletes[i].error.push(
              this.$t("import.error.organization_incorrect")
            );
          }
        } else {
          this.athletes[i].error.push(
            this.$t("import.error.organization_missing")
          );
        }
        if (this.athletes[i].error.length === 0) {
          await this.postAthlete(i);
        }
        if (this.athletes[i].error.length > 0) {
          this.athletes[i].status = this.$t("import.status.failure");
        }
        this.$refs.table.refresh();
      }
      this.debugResults = this.athletes;
      this.finished = true;
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

        reader.onload = e => {
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
     * Post or update a single athlete (API post/put)
     *
     * @param {number} i - current athlete number
     * @returns {Promise<void>}
     */
    async postAthlete(i) {
      let temp_athlete = {
        id: 0
      };
      await HTTP.get("athletes/?sport_id=" + this.athlete.sport_id)
        .then(response => {
          if (response.data.results.length === 1) {
            temp_athlete = response.data.results[0];
          }
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
      if (temp_athlete.id) {
        await HTTP.put(
          "athletes/" + temp_athlete.id + "/",
          this.athlete,
          this.config
        )
          .then(response => {
            this.athletes[i].response = response.data;
            this.athletes[i].status = this.$t("import.status.updated");
            if (response.data.first_name !== temp_athlete.first_name) {
              this.athletes[i].warning.push(
                this.$t("import.warning.first_name")
              );
            }
            if (response.data.last_name !== temp_athlete.last_name) {
              this.athletes[i].warning.push(
                this.$t("import.warning.last_name")
              );
            }
          })
          .catch(error => {
            this.athletes[i].error.push(
              ...errorParser.result.bind(this)(error)
            );
          });
      } else {
        await HTTP.post("athletes/", this.athlete, this.config)
          .then(response => {
            this.athletes[i].response = response.data;
            this.athletes[i].status = this.$t("import.status.created");
          })
          .catch(error => {
            this.athletes[i].error.push(
              ...errorParser.result.bind(this)(error)
            );
          });
      }
    }
  }
};
</script>

<style scoped></style>
