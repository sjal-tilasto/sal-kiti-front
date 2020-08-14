<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t("info.info") }}</h1>
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
        <h2 class="bg-sal-orange">{{ $tc("sport.competition_type", 1) }}</h2>
      </b-col>
    </b-row>
    <b-row v-if="loadingCompetitionType">
      <b-col>
        <b-spinner label="Loading..."></b-spinner>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("name") }}</dt>
          <dd v-if="competitionType.name">{{ competitionType.name }}</dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("abbreviation") }}</dt>
          <dd v-if="competitionType.abbreviation">
            {{ competitionType.abbreviation }}
          </dd>
        </dl>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">{{ $t("info.layout") }}</h2>
      </b-col>
    </b-row>
    <b-row v-if="loadingCompetitionTypeLayouts">
      <b-col>
        <b-spinner label="Loading..."></b-spinner>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col>
        <div v-for="(block, index) in resultBlocks" :key="index">
          <div v-if="block['label'] === 'final'">
            <h5>{{ $tc("result.final", 2) }}</h5>
          </div>
          <div v-else-if="block['label'] === 'preliminary'">
            <h5>{{ $t("result.preliminary") }}</h5>
          </div>
          <b-table
            :items="results"
            :fields="resultFields[index + 1]"
            responsive="sm"
            small
          >
            <template
              v-for="field in resultColsExtra[index + 1][1]"
              v-slot:[field.slot]="data"
            >
              <div
                v-for="row in resultColsExtra[index + 1][0][field.col]"
                v-bind:key="row"
              >
                {{ getPartialField(index + 1, row, field.col) }}
              </div>
            </template>
            <template v-slot:cell(pos)="data">
              <div>{{ $t("result.kneeling") }}</div>
              <div>{{ $t("result.prone") }}</div>
              <div>{{ $t("result.standing") }}</div>
            </template>
          </b-table>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Dispays sports information
 * - categories
 * - competition types
 */
import { HTTP } from "../api/BaseApi.js";
import errorParser from "../utils/ErrorParser";
import resultLayout from "../mixins/ResultLayout";

export default {
  name: "InfoCompetitionType",
  mixins: [resultLayout],
  data() {
    return {
      competitionType: null,
      customFields: [],
      errors: {},
      loadingCompetitionType: true,
      loadingCompetitionTypeLayouts: true,
      maxBlock: 2
    };
  },
  computed: {
    /**
     * Create results array based on fields in competition layout
     *
     * @returns [{}]
     */
    results: function() {
      let fields = {};
      for (let block = 1; block <= this.maxBlock; block++) {
        if (
          this.resultCols.length >= block &&
          this.resultCols[block].length > 0
        ) {
          for (const order in this.resultCols[block]) {
            fields[this.resultCols[block][order].name] = this.resultCols[block][
              order
            ].name;
          }
        }
      }
      return [fields];
    }
  },
  mounted() {
    this.getCompetitionType(this.$route.params.competition_type_id);
    document.title = this.$t("title.sports") + " | " + this.$t("title.prefix");
  },
  methods: {
    /**
     * Fetch competition type from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getCompetitionType(id) {
      this.loadingCompetitionType = true;
      HTTP.get("competitiontypes/" + id + "/")
        .then(response => {
          this.competitionType = response.data;
          this.getCompetitionTypeLayout(this.competitionType.layout);
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingCompetitionType = false));
    },
    /**
     * Fetch layout information for a competition
     *
     * Set default layout if not found
     *
     * @param {number} layoutType
     * @returns {Promise<void>}
     */
    async getCompetitionTypeLayout(layoutType) {
      this.loadingCompetitionTypeLayouts = true;
      HTTP.get("competitionlayouts/?type=" + layoutType)
        .then(response => {
          if (response.data.results.length > 0) {
            this.customFields = response.data.results;
          } else {
            this.customFields = [
              {
                label: "",
                name: "nolimit",
                block: 0,
                row: 0,
                col: 0,
                hide: "",
                show: ""
              },
              {
                label: "#",
                name: "position",
                block: 1,
                row: 1,
                col: 1,
                hide: "",
                show: ""
              },
              {
                label: "Athlete",
                name: "athlete",
                block: 1,
                row: 1,
                col: 2,
                hide: "",
                show: ""
              },
              {
                label: "Club",
                name: "athlete",
                block: 1,
                row: 1,
                col: 3,
                hide: "",
                show: ""
              },
              {
                label: "Result",
                name: "result",
                block: 1,
                row: 1,
                col: 4,
                hide: "",
                show: ""
              }
            ];
          }
          this.maxBlock = this.customFields[this.customFields.length - 1].block;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingCompetitionTypeLayouts = false));
    },
    /**
     * Get a field name for a partial value field
     *
     * @param {number} block
     * @param {number} row
     * @param {number} col
     * @returns {null|string}
     */
    getPartialField(block, row, col) {
      const partialField = this.resultColsExtra[block][row].find(
        f => f.col === col
      );
      if (partialField) {
        return partialField.name;
      }
      return null;
    }
  }
};
</script>

<style scoped></style>
