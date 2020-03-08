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
        <h2 class="bg-sal-orange">{{ $t("info.organization") }}</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-if="organizationsInternal.length > 0">
        <h2 class="bg-sal-orange">
          {{ $tc("info.organizations_internal", 2) }}
        </h2>
        <b-table
          :fields="organizationInternalFields"
          :items="organizationsInternal"
        >
          <template v-slot:cell(areas)="data">
            {{ data.item.areas | areaFilter(areas) }}
          </template>
        </b-table>
      </b-col>
      <b-col v-if="organizationsExternal.length > 0">
        <h2 class="bg-sal-orange">
          {{ $tc("info.organizations_external", 2) }}
        </h2>
        <b-table
          :fields="organizationExternalFields"
          :items="organizationsExternal"
        >
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Displays organization information
 */
import { HTTP } from "../api/BaseApi.js";
import errorParser from "../utils/ErrorParser";
import areaFilter from "../utils/AreaFilter";

export default {
  name: "InfoSport",
  filters: {
    areaFilter
  },
  data() {
    return {
      areas: [],
      organizations: [],
      organizationsExternal: [],
      organizationsInternal: [],
      errors: {}
    };
  },
  computed: {
    /**
     * Sets fields list for the organization list
     *
     * @returns {array} fields list
     */
    organizationExternalFields: function() {
      return [
        { key: "abbreviation", label: this.$t("abbreviation"), sortable: true },
        { key: "name", label: this.$t("name"), sortable: true }
      ];
    },
    organizationInternalFields: function() {
      return [
        { key: "abbreviation", label: this.$t("abbreviation"), sortable: true },
        { key: "name", label: this.$t("name"), sortable: true },
        { key: "areas", label: this.$t("info.area"), sortable: true }
      ];
    }
  },
  mounted() {
    this.getAreas();
    this.getOrganizations();
    document.title =
      this.$t("title.organizations") + " | " + this.$t("title.prefix");
  },
  methods: {
    /**
     * Fetch areas from API
     *
     * @returns {Promise<void>}
     */
    async getAreas() {
      HTTP.get("areas/")
        .then(response => {
          this.areas = response.data.results || [];
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
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
          this.organizationsExternal = this.organizations.filter(
            org => org.external === true
          );
          this.organizationsInternal = this.organizations.filter(
            org => org.external === false
          );
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    }
  }
};
</script>

<style scoped></style>
