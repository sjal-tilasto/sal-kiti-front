<template>
  <div>
    <b-row>
      <b-col>
        <h3 class="bg-sal-orange">
          {{ $t("sjal.ranking_rolling") }}
        </h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          v-for="d in divisionsRolling"
          v-bind:key="d.key"
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectDivisionRolling(d.key)"
          :pressed="d.key === localDivision"
        >
          {{ d.label }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3 class="bg-sal-orange">
          {{ $t("sjal.ranking_old") }}
        </h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          v-for="y in year_range"
          v-bind:key="y"
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectYear(y)"
          :pressed="y === localYear"
        >
          {{ y }} - {{ y + 1 }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          v-for="d in divisions"
          v-bind:key="d.key"
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectDivision(d.key)"
          :pressed="d.key === localDivision"
        >
          {{ d.label }}
        </b-button>
      </b-col>
    </b-row>
    <b-row v-if="localDivision && (dateEnd || localRolling)">
      <b-col>
        <h3 class="bg-sal-orange">
          {{ $tc("result.result", 2) }}
        </h3>
        <StatisticsRanking
          :division="localDivision"
          :dateStart="dateStart"
          :dateEnd="dateEnd"
          :rolling="localRolling"
          :key="localDivision + dateEnd"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Displays SJAL Ranking statistics
 */
import StatisticsRanking from "@/components/StatisticsRanking.vue";

export default {
  name: "StatisticsRankingForm",
  components: {
    StatisticsRanking
  },
  props: {
    division: {
      type: String,
      default: null
    },
    year: {
      type: Number,
      default: null
    },
    rolling: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      errors: {},
      loading: false,
      results: [],
      dateStart: null,
      dateEnd: null,
      localYear: null,
      localDivision: null,
      localRolling: false
    };
  },
  computed: {
    divisions: function () {
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
        }
      ];
    },
    divisionsRolling: function () {
      return [
        {
          key: "y",
          label: "Y"
        },
        {
          key: "n",
          label: "N"
        },
        {
          key: "yt",
          label: "YT"
        },
        {
          key: "nt",
          label: "NT"
        },
        {
          key: "yv",
          label: "YV"
        },
        {
          key: "nv",
          label: "NV"
        },
        {
          key: "ylb",
          label: "YLB"
        },
        {
          key: "nlb",
          label: "NLB"
        },
        {
          key: "ytr",
          label: "YTR"
        },
        {
          key: "ntr",
          label: "NTR"
        }
      ];
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
    if (this.$route.query.rolling) {
      this.localYear = null;
      this.localRolling = true;
    } else if (this.$route.query.year) {
      this.localYear = parseInt(this.$route.query.year);
    } else if (this.year) {
      this.localYear = this.year;
    }
    if (this.$route.query.division) {
      this.localDivision = this.$route.query.division;
    } else if (this.division) {
      this.localDivision = this.division;
    }
    if (this.localYear && this.localDivision) {
      this.dateStart = this.localYear.toString() + "-10-01";
      if (this.localYear === 2020) {
        this.dateEnd = (this.localYear + 2).toString() + "-04-30";
      } else if (this.localYear === 2022) {
        this.dateEnd = (this.localYear + 1).toString() + "-10-01";
      } else {
        this.dateEnd = (this.localYear + 1).toString() + "-09-01";
      }
    }
  },
  methods: {
    selectDivision(division) {
      this.localDivision = division;
      this.localRolling = false;
      if (this.localYear) {
        this.$router.push({
          name: "statistics-ranking",
          query: { division: this.localDivision, year: this.localYear }
        });
      }
    },
    selectDivisionRolling: function (division) {
      this.localDivision = division;
      this.localYear = null;
      this.localRolling = true;
      this.$router.push({
        name: "statistics-ranking",
        query: { division: this.localDivision, rolling: true }
      });
    },
    selectYear(year) {
      this.localYear = year;
      this.localRolling = false;
      this.dateStart = this.localYear.toString() + "-10-01";
      if (this.localYear === 2020) {
        this.dateEnd = (this.localYear + 2).toString() + "-04-30";
      } else if (this.localYear === 2022) {
        this.dateEnd = (this.localYear + 1).toString() + "-10-01";
      } else {
        this.dateEnd = (this.localYear + 1).toString() + "-09-01";
      }
      if (this.localDivision.length < 5) {
        this.localDivision = null;
      }
      if (this.localDivision) {
        this.$router.push({
          name: "statistics-ranking",
          query: { division: this.localDivision, year: this.localYear }
        });
      }
    }
  }
};
</script>

<style scoped></style>
