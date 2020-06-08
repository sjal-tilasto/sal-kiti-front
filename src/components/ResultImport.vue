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
        <h4 class="bg-sal-orange">{{ $tc("result.import", 2) }}</h4>
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
          <b-form-group
            id="input-group-type"
            label-for="input-type"
            :description="$t('import.type')"
          >
            <b-form-radio v-model="form.fileType" name="filetype" value="excel"
              >Excel / CSV</b-form-radio
            >
            <b-form-radio v-model="form.fileType" name="filetype" value="sius"
              >SIUS CSV</b-form-radio
            >
          </b-form-group>
          <b-form-group
            id="input-group-categories"
            :label="$t('import.default_category')"
            label-for="input-categories"
            v-if="form.fileType === 'sius'"
          >
            <b-form-select
              id="input-categories"
              v-model="form.category"
              :options="categories"
              textField="name"
              valueField="id"
            >
            </b-form-select>
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
            name: 'competition',
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
import XLSX from "xlsx";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";
import Papa from "papaparse";
import parseSiusData from "../utils/ParseSiusData";

export default {
  name: "ResultImport",
  data() {
    return {
      categories: [],
      competition: {},
      competitionType: {},
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
        file: null,
        fileType: "excel",
        category: null
      },
      headers: [],
      results: [],
      organizations: [],
      reader: null,
      resultTypes: [],
      result: {}
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
        { key: "category", label: this.$t("result.category") },
        { key: "result", label: this.$tc("result.result", 1) },
        { key: "warning", label: this.$t("import.warning.label") },
        { key: "error", label: this.$t("import.error.label") }
      ];
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    /**
     * Clean variables between results
     */
    cleanVariables() {
      this.result = {
        athlete: null,
        category: null,
        competition: this.$route.params.competition_id,
        info: "",
        organization: null,
        position: null,
        result: null,
        team: 0
      };
    },
    /**
     * Fetch athlete information from API
     *
     * @param {string} query
     * @returns {Promise<null>}
     */
    async getAthlete(query) {
      let athlete = null;
      await HTTP.get("athletes/" + query)
        .then(response => {
          if (response.data.results.length === 1) {
            athlete = response.data.results[0];
          }
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
      return athlete;
    },
    /**
     * Fetch categories from API for a sport
     *
     * @param {number} sport id
     * @returns {Promise<void>}
     */
    async getCategories(sport) {
      HTTP.get("categories/?sport=" + sport)
        .then(response => {
          this.categories = response.data.results || [];
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch competition information from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getCompetition(id) {
      this.competition = {};
      await HTTP.get("competitions/" + id + "/")
        .then(response => {
          this.competition = response.data || {};
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch competition result types from API
     *
     * @param {number} competitionType
     * @returns {Promise<void>}
     */
    async getCompetitionResultTypes(competitionType) {
      HTTP.get("competitionresulttypes/?competition_type=" + competitionType)
        .then(response => {
          this.resultTypes = response.data.results || [];
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch competition type information from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getCompetitionType(id) {
      this.competitionType = {};
      await HTTP.get("competitiontypes/" + id + "/")
        .then(response => {
          this.competitionType = response.data || {};
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch required information for the import
     *
     * @returns {Promise<void>}
     */
    async getData() {
      await this.getCompetition(this.$route.params.competition_id);
      await this.getCategories(this.competition.type_info.sport);
      await this.getCompetitionType(this.competition.type);
      await this.getCompetitionResultTypes(this.competitionType.id);
      await this.getOrganizations();
      await this.getResults(this.$route.params.competition_id);
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
     * Fetch organizations from API
     *
     * @returns {Promise<void>}
     */
    async getOrganizations() {
      HTTP.get("organizations/?historical=false")
        .then(response => {
          this.organizations = response.data.results || [];
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch results for a competition from API
     *
     * @param {number} id - competition id
     * @returns {Promise<void>}
     */
    async getResults(id) {
      HTTP.get("results/?competition=" + id)
        .then(response => {
          this.competitionResults = response.data.results || [];
        })
        .catch(error => {
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
          (file &&
            file.type &&
            this.form.fileType === "excel" &&
            (file.type === "application/vnd.oasis.opendocument.spreadsheet" ||
              file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) ||
          file.type === "text/csv"
        ) {
          resultData = await this.parseExcel(file);
          this.results = resultData;
          this.parseResults();
        } else if (
          file &&
          file.type &&
          this.form.fileType === "sius" &&
          file.type === "text/csv"
        ) {
          resultData = await this.parseCSV(file);
          if (resultData && resultData.data && resultData.data.length > 1) {
            this.results = parseSiusData(resultData.data);
            this.parseResults();
          }
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
     * Parse athlete from a result, based on sport_id or names and organization
     * - create a new athlete if athlete is not found and organization is external
     *
     * @param {string} sport_id
     * @param {string} first_name
     * @param {string} last_name
     * @param {string} organization
     * @returns {Promise<null>}
     */
    async parseAthlete(sport_id, first_name, last_name, organization) {
      let query = "";
      let athlete = null;
      let organizationObject = [];
      if (sport_id) {
        query = "?sport_id=" + sport_id;
      } else {
        if (first_name && last_name && organization) {
          organizationObject = this.organizations.filter(
            org => org.abbreviation === organization
          );
          if (organizationObject.length === 1) {
            query =
              "?first_name=" +
              first_name +
              "&last_name=" +
              last_name +
              "&organization=" +
              organizationObject[0].id;
          }
        }
      }
      if (query) {
        athlete = await this.getAthlete(query);
      }
      /* Create a new athlete if organization is external and athlete is not found (API post) */
      if (
        athlete == null &&
        organizationObject.length === 1 &&
        organizationObject[0].external
      ) {
        await HTTP.post(
          "athletes/",
          {
            first_name: first_name,
            last_name: last_name,
            organization: organizationObject[0].id,
            gender: "U"
          },
          this.config
        )
          .then(response => {
            athlete = response.data;
          })
          .catch(error => {
            this.$set(
              this.errors,
              "main",
              errorParser.generic.bind(this)(error)
            );
          });
      }
      return athlete;
    },
    /**
     * Parse athlete from a result, based on sport_id or names and organization
     * - create a new athlete if athlete is not found and organization is external
     *
     * @param {number} i - current result number
     * @param {array} keys - result object keys
     * @returns {Promise<null>}
     */
    async parseAthletes(i, keys) {
      let result = this.results[i];
      let sport_id = "";
      let first_name = "";
      let last_name = "";
      let organization = "";
      let athlete_organization = "";
      if ("organization" in result) {
        organization = result.organization;
      }
      if (!this.result.team) {
        if ("sport_id" in result) {
          sport_id = result.sport_id;
        }
        if ("first_name" in result) {
          first_name = result.first_name;
        }
        if ("last_name" in result) {
          last_name = result.last_name;
        }
        let athlete = await this.parseAthlete(
          sport_id,
          first_name,
          last_name,
          organization
        );
        if (athlete) {
          this.result.athlete = athlete.id;
          this.updateMissingAthleteInfo(i, athlete);
          return athlete;
        } else {
          this.results[i].error.push(this.$t("import.error.athlete"));
        }
      } else {
        let members = [];
        let memberIDs = [];
        if (
          keys.includes("team_members") &&
          this.results[i].team_members.length > 0
        ) {
          members = this.results[i].team_members.split(",");
          if (members.length < 2) {
            this.results[i].error.push(this.$t("import.error.team_min_size"));
            return null;
          }
          for (let c = 0; c < members.length; c++) {
            const athlete = await this.getAthlete("?sport_id=" + members[c]);
            if (athlete) {
              memberIDs.push(athlete.id);
            } else {
              this.results[i].error.push(
                this.$t("import.error.team_member") + ": " + members[c]
              );
            }
          }
        } else {
          const abcArray = ["a", "b", "c"];
          for (let index = 0; index < abcArray.length; index++) {
            sport_id = "";
            first_name = "";
            last_name = "";
            athlete_organization = "";
            if ("sport_id_".concat(abcArray[index]) in result) {
              sport_id = result["sport_id_".concat(abcArray[index])];
            }
            if ("first_name_".concat(abcArray[index]) in result) {
              first_name = result["first_name_".concat(abcArray[index])];
            }
            if ("last_name_".concat(abcArray[index]) in result) {
              last_name = result["last_name_".concat(abcArray[index])];
            }
            if ("organization_".concat(abcArray[index]) in result) {
              athlete_organization =
                result["organization_".concat(abcArray[index])];
            }
            if (!athlete_organization) {
              athlete_organization = organization;
            }
            let athlete = await this.parseAthlete(
              sport_id,
              first_name,
              last_name,
              athlete_organization
            );
            if (athlete) {
              memberIDs.push(athlete.id);
            }
          }
        }
        this.result.team_members = memberIDs;
      }
      return null;
    },
    /**
     * Parse category for a result
     * - check category from a form (SIUS import) if it's not listed in keys
     *
     * @param {number} i - current result number
     * @param {array} keys - result object keys
     */
    parseCategory(i, keys) {
      if (keys.includes("category")) {
        let category = this.categories.filter(
          cat => cat.abbreviation === this.results[i].category
        );
        if (category.length === 1) {
          if (
            (this.result.team && !category[0].team) ||
            (!this.result.team && category[0].team)
          ) {
            this.results[i].error.push(this.$t("import.error.category_team"));
          } else {
            this.result.category = category[0].id;
          }
        } else {
          this.results[i].error.push(
            this.$t("import.error.category_incorrect")
          );
        }
      } else if (this.form.category) {
        let category = this.categories.filter(
          cat => cat.id === this.form.category[0]
        );
        if (category.length === 1) {
          this.result.category = category[0].id;
          this.result.team = category[0].team;
        } else {
          this.results[i].error.push(
            this.$t("import.error.category_incorrect")
          );
        }
      } else {
        this.results[i].error.push(this.$t("import.error.category_missing"));
      }
      if (keys.includes("elimination_category")) {
        let eliminationCategory = this.categories.filter(
          cat => cat.abbreviation === this.results[i].elimination_category
        );
        if (eliminationCategory.length === 1) {
          this.result.elimination_category = eliminationCategory[0].id;
        } else {
          this.results[i].error.push(
            this.$t("import.error.category_elimination")
          );
        }
      }
    },
    /**
     * Read CSV file
     *
     * @param file
     * @returns {Promise<unknown>}
     */
    parseCSV(file) {
      return new Promise((complete, error) => {
        Papa.parse(file, { complete, error });
      });
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
     * Parse extra info field from a result object
     *
     * @param {number} i - current result number
     * @param {array} keys - result object keys
     */
    parseInfo(i, keys) {
      if (keys.includes("info")) {
        if (String(this.results[i].info).length <= 100) {
          this.result.info = String(this.results[i].info);
        } else {
          this.results[i].error.push(this.$t("import.error.info"));
        }
      }
    },
    /**
     * Parse organization from a result object
     * - set check warning if organization doesn't match athlete's organizations
     *
     * @param {number} i - current result number
     * @param {array} keys - result object keys
     * @param {object} athlete
     */
    parseOrganization(i, keys, athlete) {
      if (keys.includes("organization")) {
        let organization = this.organizations.filter(
          org => org.abbreviation === this.results[i].organization
        );
        if (organization.length === 0) {
          organization = this.organizations.filter(
            org => org.name === this.results[i].organization
          );
        }
        if (organization.length === 1) {
          this.result.organization = organization[0].id;
          if (athlete && this.result.organization !== athlete.organization) {
            let organizationCheck = false;
            if (athlete.additional_organizations) {
              for (
                let a = 0;
                a < athlete.additional_organizations.length;
                a++
              ) {
                if (
                  athlete.additional_organizations[a] ===
                  this.result.organization
                )
                  organizationCheck = true;
              }
            }
            if (!organizationCheck) {
              this.result.admin_info += "Check organization";
              this.results[i].warning.push(
                this.$t("import.warning.organization")
              );
            }
          }
        } else if (organization.length > 1) {
          this.results[i].error.push(
            this.$t("import.error.organization_multiple")
          );
        } else {
          this.results[i].error.push(
            this.$t("import.error.organization_incorrect")
          );
        }
      } else {
        this.results[i].error.push(
          this.$t("import.error.organization_missing")
        );
      }
    },
    /**
     * Parse partial results information
     *
     * @param {number} i - current result number
     * @param {array} keys - result object keys
     */
    parsePartialResults(i, keys) {
      let result = this.results[i];
      let partialResults = [];
      for (let key = 0; key < keys.length; key++) {
        for (let r = 0; r < this.resultTypes.length; r++) {
          if (keys[key].startsWith(this.resultTypes[r].abbreviation + "-")) {
            let partialResult = {};
            partialResult.order = parseInt(
              keys[key].substring(this.resultTypes[r].abbreviation.length + 1)
            );
            partialResult.type = this.resultTypes[r].id;
            if (typeof result[keys[key]] == "string") {
              partialResult.value = parseFloat(
                result[keys[key]].replace(",", ".")
              );
            } else {
              partialResult.value = parseFloat(result[keys[key]]);
            }
            if (String(result[keys[key]]).includes(".")) {
              partialResult.decimals =
                String(result[keys[key]]).split(".")[1].length || 0;
            } else {
              partialResult.decimals = 0;
            }
            if (
              !this.result.team &&
              this.resultTypes[r].max_result &&
              partialResult.value > this.resultTypes[r].max_result
            ) {
              this.results[i].error.push(
                this.$t("import.error.result_partial_max")
              );
            }
            if (
              this.resultTypes[r].min_result &&
              partialResult.value > this.resultTypes[r].min_result
            ) {
              this.results[i].error.push(
                this.$t("import.error.result_partial_min")
              );
            }
            partialResults.push(partialResult);
          }
        }
      }
      this.result.partial = partialResults;
    },
    /**
     * Parse position from result object
     *
     * @param {number} i - current result number
     * @param {array} keys - result object keys
     */
    parsePosition(i, keys) {
      if (keys.includes("position")) {
        if (Number.isInteger(this.results[i].position)) {
          this.result.position = this.results[i].position;
        } else {
          this.results[i].error.push(this.$t("import.error.position"));
        }
      }
      if (keys.includes("position_pre")) {
        if (Number.isInteger(this.results[i].position_pre)) {
          this.result.position_pre = this.results[i].position_pre;
        } else {
          this.results[i].error.push(this.$t("import.error.position_pre"));
        }
      }
    },
    /**
     * Parse result value from result object
     *
     * @param {number} i - current result number
     * @param {array} keys - result object keys
     */
    parseResult(i, keys) {
      if (keys.includes("result")) {
        if (typeof this.results[i].result == "string") {
          this.result.result = parseFloat(
            this.results[i].result.replace(",", ".")
          );
        } else {
          this.result.result = parseFloat(this.results[i].result);
        }
        if (String(this.result.result).includes(".")) {
          this.result.decimals =
            String(this.result.result).split(".")[1].length || 0;
        } else {
          this.result.decimals = 0;
        }
        if (
          this.competitionType.max_result &&
          this.result.result > this.competitionType.max_result &&
          !this.result.team
        ) {
          this.results[i].error.push(this.$t("import.error.result_max"));
        }
        if (
          this.competitionType.min_result &&
          this.result.result < this.competitionType.min_result &&
          !this.result.team
        ) {
          this.results[i].error.push(this.$t("import.error.result_min"));
        }
      } else {
        if (!keys.includes("result_code")) {
          this.results[i].error.push(this.$t("import.error.result"));
        }
      }
      if (keys.includes("result_code")) {
        if (String(this.results[i].result_code).length <= 3) {
          this.result.result_code = String(this.results[i].result_code);
        } else {
          this.results[i].error.push(this.$t("import.error.result_code"));
        }
      }
    },
    /**
     * Parse result information from results array
     */
    async parseResults() {
      let athlete = null;
      let keys = [];
      for (let i = 0; i < this.results.length; i++) {
        Object.keys(this.results[i]).map(
          k =>
            (this.results[i][k] =
              typeof this.results[i][k] == "string"
                ? this.results[i][k].trim()
                : this.results[i][k])
        );
        this.results[i].error = [];
        this.results[i].warning = [];
        this.results[i].status = this.$t("import.status.pending");
        this.cleanVariables();
        keys = Object.keys(this.results[i]);
        this.parseTeam(i, keys);
        this.parseCategory(i, keys);
        if (this.result.team) {
          if (
            "team_name" in this.results[i] &&
            this.results[i].team_name.length > 0
          ) {
            this.result.last_name = this.results[i].team_name;
          } else {
            this.result.last_name = "";
          }
        }
        if (this.result.category) {
          athlete = await this.parseAthletes(i, keys);
        }
        if (this.results[i].error.length === 0) {
          this.parseResult(i, keys);
          this.parsePosition(i, keys);
          this.parseOrganization(i, keys, athlete);
          this.parseInfo(i, keys);
          this.parsePartialResults(i, keys);
          if (this.results[i].error.length === 0) {
            await this.postResult(i);
          }
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
      this.finished = true;
    },
    /**
     * Set result team status based on team_members field
     *
     * @param {number} i - current result number
     * @param {array} keys - result object keys
     */
    parseTeam(i, keys) {
      let team = false;
      if (
        (keys.includes("team_members") &&
          this.results[i].team_members.length > 0) ||
        keys.includes("sport_id_a") ||
        keys.includes("first_name_a")
      ) {
        team = true;
      }
      this.result.team = team;
    },
    /**
     * Post or update a single result (API post/put)
     *
     * @param {number} i - current result number
     * @returns {Promise<void>}
     */
    async postResult(i) {
      let duplicate = [];
      if (this.result.team) {
        duplicate = this.competitionResults.filter(
          res =>
            res.team === this.result.team &&
            res.last_name === this.result.last_name &&
            res.category === this.result.category
        );
      } else {
        duplicate = this.competitionResults.filter(
          res =>
            res.athlete === this.result.athlete &&
            res.category === this.result.category
        );
      }
      if (duplicate.length > 1) {
        this.results[i].error.push(this.$t("import.error.result_duplicate"));
      }
      if (duplicate.length === 1 && this.results[i].error.length === 0) {
        await HTTP.put(
          "results/" + duplicate[0].id + "/",
          this.result,
          this.config
        )
          .then(response => {
            this.results[i].response = response.data;
          })
          .catch(error => {
            this.results[i].error.push(...errorParser.result.bind(this)(error));
          });
      } else if (this.results[i].error.length === 0) {
        await HTTP.post("results/", this.result, this.config)
          .then(response => {
            this.results[i].response = response.data;
          })
          .catch(error => {
            this.results[i].error.push(...errorParser.result.bind(this)(error));
          });
      }
    },
    /**
     * Update athlete information in result file based on information received from backend
     *
     * @param {number} i - current result number
     * @param {object} athlete
     */
    updateMissingAthleteInfo(i, athlete) {
      if (!("sport_id" in this.results[i])) {
        this.results[i].sport_id = athlete.sport_id;
      }
      if (
        "first_name" in this.results[i] &&
        this.results[i].first_name &&
        this.results[i].first_name !== athlete.first_name
      ) {
        this.results[i].warning.push(this.$t("import.warning.first_name"));
      }
      this.results[i].first_name = athlete.first_name;
      if (
        "last_name" in this.results[i] &&
        this.results[i].last_name &&
        this.results[i].last_name !== athlete.last_name
      ) {
        this.results[i].warning.push(this.$t("import.warning.last_name"));
      }
      this.results[i].last_name = athlete.last_name;
    }
  }
};
</script>

<style scoped></style>
