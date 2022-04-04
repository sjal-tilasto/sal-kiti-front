import { HTTP } from "@/api/BaseApi";
import XLSX from "xlsx";
import errorParser from "@/utils/ErrorParser";

export default {
  methods: {
    /**
     * Clean variables between results
     */
    cleanVariables() {
      this.result = {
        athlete: null,
        category: null,
        competition: this.competition.id,
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
        if (typeof this.results[i].category === "number") {
          this.results[i].category = this.results[i].category.toString();
        }
        let category = [];
        if (keys.includes("wtype")) {
          category = this.categories.filter(
            cat =>
              cat.abbreviation ===
              this.results[i].category + " (" + this.results[i].wtype + ")"
          );
        } else {
          category = this.categories.filter(
            cat => cat.abbreviation === this.results[i].category
          );
        }
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
          cat => cat.id === this.form.category
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
        for (let r = 0; r < this.competitionResultTypes.length; r++) {
          if (
            keys[key].startsWith(
              this.competitionResultTypes[r].abbreviation + "-"
            )
          ) {
            let partialResult = {};
            partialResult.order = parseInt(
              keys[key].substring(
                this.competitionResultTypes[r].abbreviation.length + 1
              )
            );
            partialResult.type = this.competitionResultTypes[r].id;
            if (typeof result[keys[key]] == "string") {
              let value = parseFloat(result[keys[key]].replace(",", "."));
              if (isNaN(value)) {
                partialResult.text = result[keys[key]];
              } else {
                partialResult.value = value;
              }
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
              this.competitionResultTypes[r].max_result &&
              partialResult.value > this.competitionResultTypes[r].max_result
            ) {
              this.results[i].error.push(
                this.$t("import.error.result_partial_max")
              );
            }
            if (
              this.competitionResultTypes[r].min_result &&
              partialResult.value < this.competitionResultTypes[r].min_result
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
        if (this.form.dryRun) {
          this.result.dry_run = true;
        }
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
      await this.getResults(this.competition.id);
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
