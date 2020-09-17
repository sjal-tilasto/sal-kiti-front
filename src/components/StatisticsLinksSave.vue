<template>
  <div>
    <b-row>
      <b-col>
        <h3 class="bg-sal-orange">{{ $t("statistics.save_link") }}</h3>
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
        <b-form @submit="onSubmit">
          <b-form-group
            id="input-group-link-name"
            :label="$t('statistics.link_name')"
            label-for="input-link-name"
          >
            <b-form-input id="input-link-name" v-model="form.name" required />
          </b-form-group>
          <b-form-group
            id="input-group-group-name"
            :label="$t('statistics.group_name')"
            label-for="input-group-name"
          >
            <b-form-input id="input-group-name" v-model="form.group" required />
          </b-form-group>
          <b-form-group
            id="input-group-highlight"
            :label="$t('statistics.highlight')"
            label-for="input-highlight"
            :description="$t('statistics.highlight_description')"
          >
            <b-form-input
              type="number"
              id="input-highlight"
              v-model="form.highlight"
            />
          </b-form-group>
          <b-form-group id="input-group-buttons" label-for="input-buttons">
            <b-button type="submit" variant="light" class="btn-orange">{{
              $t("statistics.save")
            }}</b-button>
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { HTTP } from "@/api/BaseApi";
import getCookie from "@/utils/GetCookie";
import errorParser from "@/utils/ErrorParser";

/**
 * Display save form to statistic links
 */

export default {
  name: "StatisticsLinksSave",
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
      errors: {},
      form: {
        name: "",
        group: "",
        highlight: null
      }
    };
  },
  mounted() {
    this.form.link = this.searchParameters;
  },
  methods: {
    /**
     * Create a new statistics link
     *
     * @param evt
     */
    onSubmit(evt) {
      evt.preventDefault();
      this.postStatisticsLink();
    },
    /**
     * Post a new statistic links
     *
     * @returns {Promise<void>}
     */
    async postStatisticsLink() {
      this.$set(this.errors, "main", null);
      HTTP.post("statisticslinks/", this.form, this.config)
        .then(response => {
          this.$router.push({
            name: "statistics-links",
            params: { link_id: response.data.id }
          });
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    }
  }
};
</script>

<style scoped></style>
