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
    <b-row v-if="loadingOrganizations">
      <b-col>
        <b-spinner label="Loading..."></b-spinner>
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
import areaFilter from "../utils/AreaFilter";
import apiGet from "@/mixins/ApiGet";

export default {
  name: "InfoSport",
  mixins: [apiGet],
  filters: {
    areaFilter
  },
  data() {
    return {
      areas: [],
      loadingOrganizations: true,
      organizations: [],
      errors: {}
    };
  },
  computed: {
    /**
     * Filter external organizations
     *
     * @returns {array} organization list
     */
    organizationsExternal: function() {
      return this.organizations.filter(org => org.external === true);
    },
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
    /**
     * Filter internal organizations
     *
     * @returns {array} organization list
     */
    organizationsInternal: function() {
      return this.organizations.filter(org => org.external === false);
    },
    /**
     * Sets fields list for the organization list
     *
     * @returns {array} fields list
     */
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
  }
};
</script>

<style scoped></style>
