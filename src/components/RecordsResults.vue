<template>
  <div>
    <b-row>
      <b-col>
        <h3 class="bg-sal-orange">{{ $tc("record.record", 2) }}</h3>
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
        <div v-show="loading">
          <b-spinner label="Loading..."></b-spinner>
        </div>
        <div v-for="type in results" :key="type.id">
          <h4 class="bg-sal-orange">
            {{ type[0].result.competition.type_info.name }}
          </h4>
          <b-table
            small
            :fields="resultFields"
            :items="type"
            sort-by="category"
            hover
          >
            <template v-slot:cell(category)="data">
              <div v-if="data.item.partial_result">
                {{ data.item.category }} -
                {{ data.item.partial_result.type.name }}
              </div>
              <div v-else>
                {{ data.item.category }}
              </div>
            </template>
            <template v-slot:cell(result)="data">
              <div v-if="data.item.partial_result">
                {{
                  data.item.partial_result.value
                    | roundValue(data.item.partial_result.decimals)
                }}
              </div>
              <div v-else>
                {{
                  data.item.result.result
                    | roundValue(data.item.result.decimals)
                }}
              </div>
            </template>
            <template v-slot:cell(approved)="data">
              <div v-if="data.item.approved">
                {{ $t("record.approved") }}
                <b-button
                  v-if="$store.state.editMode && $store.state.user.is_staff"
                  size="sm"
                  variant="outline-danger"
                  v-on:click="toggleApproval(data)"
                  :name="'approverecord-' + data.item.id"
                >
                  {{ $t("record.cancel_approval") }}
                </b-button>
              </div>
              <div v-else>
                {{ $t("record.preliminary") }}
                <b-button
                  v-if="$store.state.editMode && $store.state.user.is_staff"
                  size="sm"
                  variant="outline-success"
                  class="space-right"
                  v-on:click="toggleApproval(data)"
                >
                  {{ $t("record.approve") }}
                </b-button>
                <b-button
                  v-if="
                    $store.state.editMode &&
                      $store.state.user.is_staff &&
                      !data.item.approved
                  "
                  class="btn-danger"
                  v-on:click="deleteConfirm(data.item.id)"
                >
                  {{ $t("remove") }}
                </b-button>
              </div>
            </template>
            <template v-slot:cell(athlete)="data">
              <div v-if="data.item.result.athlete">
                <router-link
                  tag="a"
                  :to="{
                    name: 'athlete',
                    params: { athlete_id: data.item.result.athlete.id }
                  }"
                >
                  {{ data.item.result.first_name }}
                  {{ data.item.result.last_name }}
                </router-link>
              </div>
              <div v-else>
                {{ $t("team") }}: {{ data.item.result.last_name }}
                <ul>
                  <li
                    v-for="member in data.item.result.team_members"
                    :key="member.id"
                  >
                    <router-link
                      tag="a"
                      :to="{
                        name: 'athlete',
                        params: { athlete_id: member.id }
                      }"
                    >
                      {{ member.first_name }} {{ member.last_name }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </template>
            <template v-slot:cell(competition)="data">
              <router-link
                tag="a"
                :to="{
                  name: 'competition',
                  params: { competition_id: data.item.result.competition.id }
                }"
              >
                {{ data.item.result.competition.name }}
              </router-link>
            </template>
            <template v-slot:cell(date)="data">
              {{ data.item.date_start }}
            </template>
          </b-table>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Display record list
 */
import { HTTP } from "../api/BaseApi.js";
import roundValue from "../utils/RoundValueFilter";
import groupArrayByKey from "../utils/GroupArrayByKey";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";

export default {
  name: "Records",
  filters: {
    roundValue
  },
  props: {
    searchParameters: String
  },
  data() {
    return {
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      currentPage: 1,
      errors: {},
      loading: false,
      results: [],
      selectMode: "single"
    };
  },
  computed: {
    /**
     * Sets fields list for the records table
     *
     * @returns {array} fields list
     */
    resultFields: function() {
      const fields = [
        { key: "category", label: this.$t("result.category"), sortable: true },
        { key: "result", label: this.$tc("result.result", 1), sortable: true },
        { key: "approved", label: this.$t("record.status"), sortable: true },
        { key: "athlete", label: this.$tc("athlete.athlete", 1) },
        {
          key: "result.organization",
          label: this.$tc("athlete.club", 1),
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell"
        },
        {
          key: "competition",
          label: this.$tc("competition.competition", 1),
          thClass: "d-none d-lg-table-cell",
          tdClass: "d-none d-lg-table-cell"
        },
        {
          key: "date",
          label: this.$t("date"),
          thClass: "d-none d-lg-table-cell",
          tdClass: "d-none d-lg-table-cell",
          sortable: true
        }
      ];
      if (this.searchParameters.includes("level")) {
        return fields;
      } else {
        return [
          {
            key: "level",
            label: this.$t("record.level"),
            thClass: "d-none d-lg-table-cell",
            tdClass: "d-none d-lg-table-cell",
            sortable: true
          }
        ].concat(fields);
      }
    }
  },
  watch: {
    /**
     * Fetch records when parameters change
     */
    searchParameters: {
      handler: function() {
        this.getRecords();
      }
    }
  },
  mounted() {
    this.getRecords();
  },
  methods: {
    /**
     * Show confirm message on delete
     *
     * @param {number} record id
     */
    deleteConfirm(record) {
      this.$bvModal
        .msgBoxConfirm(this.$t("confirm.delete"), {
          okTitle: this.$t("confirm.yes"),
          cancelTitle: this.$t("confirm.cancel")
        })
        .then(value => {
          if (value === true) {
            this.deleteRecord(record);
          }
        });
    },
    /**
     * Delete the record (API delete)
     *
     * @param {number} record id
     * @returns {Promise<void>}
     */
    async deleteRecord(record) {
      this.$set(this.errors, "main", null);
      HTTP.delete("records/" + record + "/", this.config)
        .then(response => {
          if (response.status === 204) {
            this.getRecords();
          }
        })
        .catch(error => {
          this.$set(
            this.errors,
            "main",
            errorParser.partialResult.bind(this)(error)
          );
        });
    },
    /**
     * Fetch records from API
     * - Group by competition type
     *
     * @returns {Promise<void>}
     */
    async getRecords() {
      this.$set(this.errors, "main", null);
      let url = "recordlist/" + this.searchParameters;
      this.loading = true;
      this.results = [];
      HTTP.get(url)
        .then(response => {
          this.results = groupArrayByKey(response.data.results, "type");
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loading = false));
    },
    /**
     * Set approval status for the result (API patch)
     *
     * @param {object} data - result object
     * @returns {Promise<void>}
     */
    toggleApproval: async function(data) {
      this.$set(this.errors, "main", null);
      await HTTP.patch(
        "records/" + data.item.id + "/",
        { approved: !data.item.approved },
        this.config
      )
        .then(response => {
          data.item.approved = response.data.approved;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    }
  }
};
</script>

<style scoped></style>
