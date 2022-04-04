F<template>
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
        <b-form @submit="onSubmitYear">
          <b-form-group
            id="input-group-year"
            :label="$t('year')"
            label-for="input-year"
          >
            <b-form-select v-model="form.year" :options="years"></b-form-select>
          </b-form-group>
          <b-form-checkbox
            id="checkbox-dry-run"
            v-model="form.dryRun"
            name="checkbox-dry-run"
          >
            {{ $t("import.dry_run") }}
          </b-form-checkbox>
          <b-button
            type="submit"
            variant="light"
            class="btn-orange space-right"
            >{{ $t("submit") }}</b-button
          >
        </b-form>
      </b-col>
    </b-row>
    <b-row
      v-if="
        pelias.competitions.length > 0 &&
          this.pelias.competitionDivisions.length === 0
      "
    >
      <b-col>
        <b-table
          :items="pelias.competitions"
          ref="table"
          @row-clicked="selectPeliasCompetition"
          small
          hover
        >
        </b-table>
      </b-col>
    </b-row>
    <b-row v-if="this.pelias.competitionDivisions.length > 0">
      <b-col>
        <b-table
          :items="this.pelias.competitionDivisions"
          ref="table"
          @row-clicked="selectDivision"
          small
          hover
        >
        </b-table>
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
import axios from "axios";
import getCookie from "../utils/GetCookie";
import apiGet from "@/mixins/ApiGet";
import resultImport from "@/mixins/ResultImport";
import errorParser from "@/utils/ErrorParser";
import { HTTP } from "@/api/BaseApi";

export default {
  name: "ResultImportPelias",
  mixins: [apiGet, resultImport],
  data() {
    return {
      categories: [],
      competition: {},
      competitionId: null,
      competitions: [],
      competitionOrganization: null,
      competitionType: {},
      competitionTypes: [],
      competitionResults: [],
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      debugResults: null,
      errors: [],
      event: null,
      events: [],
      finished: false,
      form: {
        dryRun: null,
        year: null
      },
      headers: [],
      results: [],
      organizations: [],
      reader: null,
      competitionResultTypes: [],
      pelias: {
        competition: null,
        competitions: [],
        competitionDivisions: [],
        competitionDiscipline: null,
        divisionResults: [],
        nationals: []
      },
      result: {},
      staticFields: [
        "category",
        "wtype",
        "info",
        "elimination_category",
        "sport_id",
        "first_name",
        "last_name",
        "organization",
        "team_members",
        "team_name",
        "position",
        "position_pre",
        "result",
        "result_code",
        "sport_id_a",
        "first_name_a",
        "last_name_a",
        "organization_a",
        "sport_id_b",
        "first_name_b",
        "last_name_b",
        "organization_b",
        "sport_id_c",
        "first_name_c",
        "last_name_c",
        "organization_c"
      ]
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
    },
    years() {
      const year = new Date().getFullYear();
      return Array.from(
        { length: year - 2003 },
        (value, index) => year - index
      );
    }
  },
  methods: {
    /**
     * Fetch competition list from Pelias
     *
     * @param {string} year - year
     *
     * @returns {Promise<void>}
     */
    async getPeliasCompetitions(year) {
      axios
        .get(process.env.VUE_APP_PELIAS_API_URL + "competitions/" + year)
        .then(response => {
          this.pelias.competitions = response.data.data;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch nationals from Pelias
     *
     * @param {string} year - year
     *
     * @returns {Promise<void>}
     */
    async getPeliasNationals(year) {
      axios
        .get(process.env.VUE_APP_PELIAS_API_URL + "competitions/" + year)
        .then(response => {
          this.pelias.nationals = response.data.data;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch competition divisions from Pelias
     *
     * @param {string} competition - Pelias competition id'
     *
     * @returns {Promise<void>}
     */
    async getPeliasCompetitionDivisions(competition) {
      await axios
        .get(
          process.env.VUE_APP_PELIAS_API_URL +
            "competition_divisions/" +
            competition
        )
        .then(response => {
          this.pelias.competitionDivisions = response.data.data;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch discipline from Pelias
     *
     * @param {string} id - Pelias discipline id'
     *
     * @returns {Promise<void>}
     */
    async getPeliasDiscipline(id) {
      await axios
        .get(process.env.VUE_APP_PELIAS_API_URL + "discipline/" + id)
        .then(response => {
          this.pelias.competitionDiscipline = response.data.data;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch competition divisions from Pelias
     *
     * @param {string} competition - Pelias competition id
     * @param {string} division - Pelias division id
     *
     * @returns {Promise<void>}
     */
    async getPeliasCompetitionDivisionResults(competition, division) {
      await axios
        .get(
          process.env.VUE_APP_PELIAS_API_URL +
            "competition_division_matchscores/" +
            competition +
            "/" +
            division
        )
        .then(response => {
          this.pelias.divisionResults = response.data.data;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Select a year and get Pelias competitions
     *
     * @param event
     *
     * @returns {Promise<void>}
     */
    async onSubmitYear(event) {
      this.errors = [];
      event.stopPropagation();
      event.preventDefault();
      let year = this.form.year;
      if (year) {
        await this.getPeliasCompetitions(year);
        await this.getPeliasNationals(year);
      }
      this.results = [];
    },
    /**
     * Get event
     *
     * @param {object} item - Pelias competition object
     */
    async getEvents(item) {
      let searchUrl =
        "events/?start=" +
        item.enddate +
        "&until=" +
        item.enddate +
        "&name=" +
        item.name;
      await HTTP.get(searchUrl)
        .then(response => {
          this.events = response.data.results || [];
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Get competitions in event
     *
     * @param {object} event - event object
     */
    async getCompetitions(event) {
      let searchUrl = "competitions/?event=" + event;
      await HTTP.get(searchUrl)
        .then(response => {
          this.competitions = response.data.results || [];
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Get competition types for a sport
     *
     * @param {object} sport - sport id
     */
    async getCompetitionTypes(sport) {
      let searchUrl = "competitiontypes/?sport=" + sport;
      await HTTP.get(searchUrl)
        .then(response => {
          this.competitionTypes = response.data.results || [];
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch single organization id by abbreviation
     *
     * @param {string} abbreviation - organization abbreviation
     * @returns {Promise<void>}
     */
    async getOrganization(abbreviation) {
      await HTTP.get("organizations/?abbreviation=" + abbreviation)
        .then(response => {
          if (response.data.results.length === 1) {
            this.competitionOrganization = response.data.results[0].id;
          } else {
            this.$set(this.errors, "main", [
              this.$t("import.error.pelias_no_orgnization_found")
            ]);
          }
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Create a competition
     *
     * @param {object} type - competition type
     */
    async createCompetition(type) {
      let level = 12;
      if (
        this.pelias.nationals.filter(
          item => (item.competition_id = this.pelias.competition.id)
        )
      ) {
        level = 8;
      } else if (
        this.pelias.competition.level === "2" ||
        this.pelias.competition.level === "3"
      ) {
        level = 9;
      }
      let competition = {
        date_end: this.event.date_end,
        date_start: this.event.date_start,
        event: this.event.id,
        level: level,
        location: this.event.location,
        name: this.event.name,
        description: "",
        organization: this.event.organization,
        type: type
      };
      competition.layout = this.competitionTypes.find(
        obj => obj.id === type
      ).layout;
      await HTTP.post("competitions/", competition, this.config)
        .then(response => {
          this.competition = response.data;
        })
        .catch(error => {
          this.errors = errorParser.form.bind(this)(error);
        });
    },
    /**
     * Create an event
     *
     * @param {object} item - competition object
     */
    async createEvent(item) {
      await this.getOrganization(item.club_shortname);
      let event = {
        date_end: item.enddate,
        date_start: item.enddate,
        location: item.location,
        name: item.name,
        description: "",
        organization: this.competitionOrganization,
        web_page: "",
        invitation: "",
        toc_agreement: true
      };
      await HTTP.post("events/", event, this.config)
        .then(response => {
          this.event = response.data;
        })
        .catch(error => {
          this.errors = errorParser.form.bind(this)(error);
        });
    },
    /**
     * Selects a Pelias competition and creates event
     *
     * @param {object} item - competition object
     */
    async selectPeliasCompetition(item) {
      this.pelias.competition = item;
      await this.getEvents(item);
      if (this.events.length === 1) {
        this.event = this.events[0];
      } else if (this.events.length > 1) {
        this.$set(this.errors, "main", [
          this.$t("import.error.pelias_multiple_events_found")
        ]);
      } else {
        await this.createEvent(item);
      }
      if (this.event) {
        await this.getPeliasCompetitionDivisions(item.id);
        await this.getPeliasDiscipline(item.discipline_id);
        await this.getCompetitions(this.event.id);
        await this.getCompetitionTypes(5);
      }
    },
    /**
     * Selects a Pelias division, creates a competition and imports results
     *
     * @param {object} division - division object
     */
    async selectDivision(division) {
      this.results = [];
      this.errors = [];
      let competitionType = this.competitionTypes.filter(
        item =>
          item.name ===
          this.pelias.competitionDiscipline.name + " " + division.name
      );
      if (competitionType.length === 1) {
        let competition = this.competitions.filter(
          item => item.type === competitionType[0].id
        );
        if (competition.length === 1) {
          this.competition = competition[0];
        } else if (competition.length === 0) {
          await this.createCompetition(competitionType[0].id);
        }
      } else if (competitionType.length === 0) {
        this.$set(this.errors, "main", [
          this.$t("import.error.pelias_no_competition_type_found") +
            " " +
            this.pelias.competitionDiscipline.name +
            " " +
            division.name
        ]);
      } else {
        this.$set(this.errors, "main", [
          this.$t(
            "import.error.pelias_multiple_competition_types_found" +
              " " +
              this.pelias.competitionDiscipline.name +
              " " +
              division.name
          )
        ]);
      }
      if (!this.errors.main && this.competition) {
        await this.getCategories(this.competition.type_info.sport);
        await this.getCompetitionType(this.competition.type);
        await this.getCompetitionResultTypes(this.competitionType.id);
        await this.getOrganizations(true, false, false);
        await this.getResults(this.competition.id);
        await this.getPeliasCompetitionDivisionResults(
          this.pelias.competition.id,
          division.id
        );
        let rank_junior = 1;
        let rank_superjunior = 1;
        let rank_lady = 1;
        let rank_senior = 1;
        let rank_supersenior = 1;
        let rank_yleinen = 1;
        for (let item in this.pelias.divisionResults) {
          let rank = 0;
          let category = "Y";
          if (this.pelias.divisionResults[item].category_name === "Junior") {
            category = "J";
            rank = rank_junior;
            rank_junior++;
          } else if (
            this.pelias.divisionResults[item].category_name === "Super Junior"
          ) {
            category = "JJ";
            rank = rank_superjunior;
            rank_superjunior++;
          } else if (
            this.pelias.divisionResults[item].category_name === "Lady"
          ) {
            category = "L";
            rank = rank_lady;
            rank_lady++;
          } else if (
            this.pelias.divisionResults[item].category_name === "Senior"
          ) {
            category = "S";
            rank = rank_senior;
            rank_senior++;
          } else if (
            this.pelias.divisionResults[item].category_name === "Super Senior"
          ) {
            category = "SS";
            rank = rank_supersenior;
            rank_supersenior++;
          } else {
            rank = rank_yleinen;
            rank_yleinen++;
          }
          let result = {
            category: category,
            elimination_category: "Y",
            last_name: this.pelias.divisionResults[item].member_lastname,
            first_name: this.pelias.divisionResults[item].member_firstname,
            sport_id: this.pelias.divisionResults[item].member_sportti_id || "",
            result: this.pelias.divisionResults[item].percentage,
            organization: this.pelias.divisionResults[item].club_shortname,
            position_pre: parseInt(this.pelias.divisionResults[item].rank),
            position: rank
          };
          this.results.push(result);
        }
        if (!this.errors.main) {
          await this.parseResults();
        }
      }
    }
  }
};
</script>

<style scoped></style>
