<template>
  <div>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">{{ $tc("competition.competition", 2) }}</h2>
      </b-col>
    </b-row>
    <b-row v-if="$store.state.editMode && createPermission">
      <b-col>
        <b-button
          :to="{
            name: 'competition-create',
            params: { event_id: $route.params.event_id }
          }"
          variant="light"
          class="btn-orange float-right"
          >{{ $tc("competition.add", 2) }}
        </b-button>
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
        <b-pagination
          v-model="currentPage"
          :total-rows="competitions.count"
          :per-page="competitions.limit"
          align="right"
          v-if="competitions.count > competitions.limit"
        >
        </b-pagination>
        <b-table
          :fields="listFields"
          :items="competitions.results"
          @row-clicked="linkTo"
          @row-middle-clicked="linkToNewTab"
          hover
        >
          <template v-slot:cell(date)="data">
            <div v-if="data.item.date_start === data.item.date_end">
              {{ data.item.date_start }}
            </div>
            <div v-else>
              {{ data.item.date_start }} - {{ data.item.date_end }}
            </div>
            <b-button
              v-if="$store.state.editMode && $store.state.user.is_staff"
              :to="{
                name: 'admin',
                params: {
                  model_name: 'competition',
                  object_id: data.item.id
                }
              }"
              variant="light"
              class="btn-orange btn-sm"
              >{{ $t("admin") }}
            </b-button>
          </template>
        </b-table>
        <div v-show="loadingCompetitions">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Displays a list of competitions
 *
 * Optional add button if user has create permissions
 */
import { HTTP } from "../api/BaseApi.js";
import errorParser from "../utils/ErrorParser";

export default {
  name: "CompetitionList",
  props: {
    createPermission: Boolean
  },
  data() {
    return {
      competitions: [],
      currentPage: 1,
      errors: {},
      limit: 100,
      loadingCompetitions: true,
      selectMode: "single"
    };
  },
  computed: {
    /**
     * Sets fields list for the competition table
     *
     * @returns {array} fields list
     */
    listFields: function () {
      return [
        { key: "date", label: this.$t("date") },
        {
          key: "type_info.name",
          label: this.$t("competition.type"),
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell"
        },
        {
          key: "type_info.abbreviation",
          label: this.$t("competition.type"),
          thClass: "d-md-none",
          tdClass: "d-md-none"
        },
        {
          key: "level_info.name",
          label: this.$t("competition.level"),
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell"
        },
        {
          key: "level_info.abbreviation",
          label: this.$t("competition.level"),
          thClass: "d-md-none",
          tdClass: "d-md-none"
        }
      ];
    }
  },
  watch: {
    /**
     * Fetch new set of competitions on page change
     */
    currentPage: {
      handler: function () {
        this.getCompetitions(this.$route.params.event_id);
      }
    }
  },
  mounted() {
    this.getCompetitions(this.$route.params.event_id);
  },
  methods: {
    /**
     * Fetch competitions for the single event
     *
     * @param id - event id
     * @returns {Promise<void>}
     */
    async getCompetitions(id) {
      this.$set(this.errors, "main", null);
      this.loadingCompetitions = true;
      this.competitions = [];
      let searchUrl = "competitions/?event=" + id + "&limit=" + this.limit;
      if (this.currentPage) {
        if (
          !this.competitions.count ||
          this.competitions.count <= (this.currentPage - 1) * this.limit
        ) {
          this.currentPage = 1;
        }
        searchUrl = searchUrl + "&page=" + this.currentPage;
      }
      HTTP.get(searchUrl)
        .then((response) => {
          this.competitions = response.data || [];
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingCompetitions = false));
    },
    /**
     * Routes to competition information when row is clicked
     *
     * @param {object} item - competition object
     */
    linkTo(item) {
      this.$router.push({
        name: "competition",
        params: { competition_id: item.id }
      });
    },
    /**
     * Opens competition information in new window when row is clicked
     *
     * @param {object} item - competition object
     */
    linkToNewTab(item) {
      let routeData = this.$router.resolve({
        name: "competition",
        params: { competition_id: item.id }
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>

<style scoped></style>
