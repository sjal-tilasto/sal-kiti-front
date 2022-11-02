<template>
  <div>
    <b-row>
      <b-col>
        <h3 class="bg-sal-orange">
          {{ $t("sjal.divari.divari") }}
        </h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          v-for="s in seasons"
          v-bind:key="s.id"
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectSeason(s.id)"
          :pressed="s.id === season"
        >
          {{ s.name }}
        </b-button>
        <b-button
          v-if="season && $store.state.editMode && $store.state.user.is_staff"
          variant="success"
          class="space-down"
          v-on:click="calculateSeasonResults(season)"
        >
          <span v-if="seasonCalculation === 0">{{
            $t("sjal.divari.calculate_results")
          }}</span>
          <span v-else-if="seasonCalculation === 1">{{
            $t("sjal.divari.calculating")
          }}</span>
          <span v-else>{{ $t("sjal.divari.calculated") }}</span>
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          v-for="bow in bowTypes"
          v-bind:key="bow.key"
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectBowType(bow.key)"
          :pressed="bow.key === bowType"
        >
          {{ bow.label }}
        </b-button>
      </b-col>
      <b-col>
        <b-button
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectCompetitions()"
          :pressed="competitions"
        >
          {{ $tc("competition.competition", 2) }}
        </b-button>
      </b-col>
    </b-row>
    <b-row v-if="season && competitions && dateEnd">
      <b-col>
        <h3 class="bg-sal-orange">
          {{ $tc("competition.competition", 2) }}
        </h3>
        <DivariCompetitionList
          :season="season"
          :dateStart="dateStart"
          :dateEnd="dateEnd"
          :key="season"
        />
      </b-col>
    </b-row>
    <b-row v-if="season && bowType">
      <b-col>
        <h3 class="bg-sal-orange">
          {{ $tc("result.result", 2) }}
        </h3>
        <DivariSeasonResults
          :season="season"
          :bowType="bowType"
          :key="bowType + season"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Displays SJAL Ranking statistics
 */
import DivariCompetitionList from "@/components/DivariCompetitionList.vue";
import DivariSeasonResults from "@/components/DivariSeasonResults.vue";

import { HTTP } from "../api/BaseApi";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";

export default {
  name: "StatisticsDivariForm",
  components: {
    DivariCompetitionList,
    DivariSeasonResults
  },
  props: {
    setBowType: {
      type: String,
      default: null
    },
    setSeason: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      errors: {},
      loading: false,
      results: [],
      seasons: [],
      season: null,
      bowType: null,
      competitions: false,
      seasonCalculation: 0
    };
  },
  computed: {
    bowTypes: function () {
      return [
        {
          key: "recurve",
          label: this.$t("sjal.recurve")
        },
        {
          key: "compound",
          label: this.$t("sjal.compound")
        },
        {
          key: "barebow",
          label: this.$t("sjal.barebow")
        },
        {
          key: "longbow",
          label: this.$t("sjal.longbow")
        },
        {
          key: "junrecurve",
          label: this.$t("sjal.junrecurve")
        },
        {
          key: "juncompound",
          label: this.$t("sjal.juncompound")
        },
        {
          key: "junbarebow",
          label: this.$t("sjal.junbarebow")
        }
      ];
    },
    dateEnd: function () {
      if (this.season && this.seasons.length > 0) {
        return this.seasons.find((s) => s.id === this.season).date_end;
      }
      return null;
    },
    dateStart: function () {
      if (this.season && this.seasons.length > 0) {
        return this.seasons.find((s) => s.id === this.season).date_start;
      }
      return null;
    },
    /**
     * Sets fields list for the statistics list
     *
     * @returns {array} fields list
     */
    resultFields: function () {
      return [
        {
          key: "organization.name",
          label: this.$t("athlete.club")
        },
        {
          key: "organization.abbreviation",
          label: this.$t("abbreviation")
        },
        { key: "value", label: this.$tc("result.result", 1) }
      ];
    },
    /**
     * Sets year options list
     *
     * @returns {array} year list
     */
    year_range: function () {
      let endYear = new Date().getFullYear();
      let years = [];
      let startYear = 2017;
      if (new Date().getMonth() < 10) {
        endYear--;
      }
      while (startYear <= endYear) {
        years.unshift(startYear++);
      }
      return years;
    }
  },
  mounted() {
    if (this.$route.query.season) {
      this.season = parseInt(this.$route.query.season);
    }
    if (this.$route.query.bow_type) {
      this.bowType = this.$route.query.bow_type;
    } else if (this.$route.query.competitions) {
      this.competitions = true;
    }

    this.getSeasons();
  },
  methods: {
    /**
     * Calculates season results
     *
     * @param {number} season - season id
     */
    async calculateSeasonResults(season) {
      if (this.seasonCalculation === 0) {
        this.seasonCalculation = 1;
        this.$set(this.errors, "main", null);
        HTTP.post("divari/calculate", { season: season }, this.config)
          .then((response) => {
            if ("calculated" in response.data && response.data.calculated) {
              this.seasonCalculation = 2;
            }
          })
          .catch((error) => {
            this.$set(
              this.errors,
              "main",
              errorParser.generic.bind(this)(error)
            );
          });
      }
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
     * Select the bow type and push route
     */
    selectBowType(bowType) {
      this.competitions = false;
      this.bowType = bowType;
      if (this.season) {
        this.$router.push({
          name: "divari",
          query: { bow_type: this.bowType, season: this.season }
        });
      }
    },
    /**
     * Select the competition and push route
     */
    selectCompetitions() {
      this.bowType = null;
      this.competitions = true;
      if (this.season) {
        this.$router.push({
          name: "divari",
          query: { competitions: true, season: this.season }
        });
      }
    },
    /**
     * Select the season and push route
     */
    selectSeason(id) {
      this.season = id;
      this.seasonCalculation = 0;
      if (this.division) {
        this.$router.push({
          name: "divari",
          query: { bow_type: this.bowType, season: this.season }
        });
      }
    }
  }
};
</script>

<style scoped></style>
