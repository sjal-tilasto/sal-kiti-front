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
    <b-row v-if="loadingStatisticsLinks">
      <b-col>
        <b-spinner label="Loading..."></b-spinner>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col
        cols="12"
        md="6"
        xl="4"
        v-for="group in groups"
        v-bind:key="group.id"
      >
        <h3 class="bg-sal-orange">{{ group[0].group }}</h3>
        <ul>
          <li v-for="link in group" v-bind:key="link.id">
            <router-link
              tag="a"
              :to="{
                name: 'statistics-link',
                params: { link_id: link.id }
              }"
              @click.native="activateLink(link)"
              >{{ link.name }}</router-link
            ><b-button
              size="sm"
              variant="outline-danger"
              class="btn-orange space-left"
              v-on:click="deleteLink(link.id)"
              v-if="$store.state.user.is_staff && $store.state.editMode"
            >
              {{ $t("remove") }}
            </b-button>
          </li>
        </ul>
      </b-col>
    </b-row>
    <StatisticsResults
      v-if="searchParameters"
      :searchParameters="searchParameters"
      :description="description"
      :header="header"
      :highlight="highlight"
      :key="searchParameters"
    />
  </div>
</template>

<script>
/**
 * Display statistic search form
 */
import StatisticsResults from "@/components/StatisticsResults.vue";
import apiGet from "../mixins/ApiGet";
import groupArrayByKey from "../utils/GroupArrayByKey";
import { HTTP } from "@/api/BaseApi";
import errorParser from "@/utils/ErrorParser";
import getCookie from "@/utils/GetCookie";

export default {
  name: "StatisticsLinks",
  mixins: [apiGet],
  components: {
    StatisticsResults
  },
  data() {
    return {
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      description: "",
      errors: {},
      header: null,
      highlight: null,
      loadingStatisticsLinks: false,
      searchParameters: null,
      statisticsLinks: []
    };
  },
  computed: {
    groups: function () {
      return groupArrayByKey(this.statisticsLinks, "group");
    }
  },
  watch: {
    loadingStatisticsLinks: function () {
      if (this.$route.params && this.$route.params.link_id) {
        this.selectLink(this.$route.params.link_id);
      }
    }
  },
  mounted() {
    this.getStatisticsLinks();
  },
  methods: {
    activateLink(link) {
      this.description = link.description;
      this.header = link.name;
      this.highlight = link.highlight;
      this.searchParameters = link.link;
      this.$router
        .push({
          name: "statistics-link",
          params: { link_id: link.id }
        })
        .catch((err) => {});
    },
    /**
     * Deletes a statistics link
     *
     * @param {number} id
     */
    async deleteLink(id) {
      this.$set(this.errors, "main", null);
      HTTP.delete("statisticslinks/" + id + "/", this.config)
        .then((response) => {
          if (response.status === 204) {
            this.getStatisticsLinks();
          }
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.result.bind(this)(error));
        });
    },
    selectLink(id) {
      let link = this.statisticsLinks.find((obj) => {
        return obj.id == id;
      });
      if (link) {
        this.activateLink(link);
      }
    }
  }
};
</script>

<style scoped></style>
