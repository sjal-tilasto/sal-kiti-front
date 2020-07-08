<template>
  <div>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange" v-if="edit">{{ $t("event.edit") }}</h2>
        <h2 class="bg-sal-orange" v-else>{{ $t("event.add") }}</h2>
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
            id="input-group-organization"
            :label="$t('organizer')"
            label-for="input-organization"
          >
            <b-form-select
              id="input-organization"
              v-model="form.organization"
              :options="organizations"
              textField="name"
              valueField="id"
              required
            >
            </b-form-select>
          </b-form-group>
          <b-form-group
            id="input-group-name"
            :label="$t('name')"
            label-for="input-name"
          >
            <b-form-input
              id="input-name"
              v-model="form.name"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-description"
            :label="$t('description')"
            label-for="input-description"
            :description="$t('event.description_help')"
          >
            <b-form-textarea
              id="input-description"
              v-model="form.description"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>
          <b-form-group
            id="input-group-location"
            :label="$t('location')"
            label-for="input-location"
          >
            <b-form-input
              id="input-location"
              v-model="form.location"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-date-start"
            :label="$t('date_start')"
            label-for="input-date-start"
          >
            <b-form-input
              id="input-date-start"
              v-model="form.date_start"
              type="date"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-date-end"
            :label="$t('date_end')"
            label-for="input-date-end"
          >
            <b-form-input
              id="input-date-end"
              v-model="form.date_end"
              type="date"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-web_page"
            :label="$t('event.web_page')"
            label-for="input-web_page"
            :description="$t('event.web_page_help')"
          >
            <b-form-input id="input-web_page" v-model="form.web_page">
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-invitation"
            :label="$t('event.invitation')"
            label-for="input-invitation"
            :description="$t('event.invitation_help')"
          >
            <b-form-input id="input-invitation" v-model="form.invitation">
            </b-form-input>
          </b-form-group>
          <div>
            <b-button
              type="submit"
              variant="light"
              class="btn-orange space-right"
            >
              <section v-if="edit">{{ $t("update") }}</section>
              <section v-else>{{ $t("create") }}</section>
            </b-button>
          </div>
          <br />
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Event create and edit form
 */
import { HTTP } from "../api/BaseApi.js";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";

export default {
  name: "EventForm",
  data() {
    return {
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      edit: false,
      errors: {},
      eventId: null,
      form: {
        date_end: null,
        date_start: null,
        location: null,
        name: null,
        description: "",
        organization: null,
        web_page: "",
        invitation: "",
        toc_agreement: true
      },
      organizations: []
    };
  },
  mounted() {
    this.getOrganizations();
    if (this.$route.params.event_id) {
      this.edit = true;
      this.getEvent(this.$route.params.event_id);
      this.eventId = this.$route.params.event_id.toString();
    }
  },
  methods: {
    /**
     * Fetch event information from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getEvent(id) {
      HTTP.get("events/" + id + "/")
        .then(response => {
          this.form = response.data || {};
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch organizations from API
     * @returns {Promise<void>}
     */
    async getOrganizations() {
      HTTP.get("organizations/?limit=own")
        .then(response => {
          this.organizations = response.data;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Create or edit event
     *
     * @param evt
     */
    onSubmit(evt) {
      evt.preventDefault();
      if (this.$route.params.event_id) {
        this.putEvent(this.$route.params.event_id);
      } else {
        this.postEvent();
      }
    },
    /**
     * Create a new event
     *
     * @returns {Promise<void>}
     */
    async postEvent() {
      this.$set(this.errors, "main", null);
      HTTP.post("events/", this.form, this.config)
        .then(response => {
          this.$router.push({
            name: "event",
            params: { event_id: response.data.id }
          });
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Edit event
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async putEvent(id) {
      this.$set(this.errors, "main", null);
      HTTP.put("events/" + id + "/", this.form, this.config)
        .then(response => {
          this.$router.push({
            name: "event",
            params: { event_id: response.data.id }
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
