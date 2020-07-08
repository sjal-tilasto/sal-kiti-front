<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $tc("event.event", 1) }}: {{ event.name }}</h1>
      </b-col>
      <b-col v-if="$store.state.editMode && editPermission">
        <b-button
          :to="{ name: 'event-update', params: { id: event.id } }"
          variant="light"
          class="btn-orange float-right"
          >{{ $tc("event.edit", 2) }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">{{ $t("event.info") }}</h2>
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
    <b-row v-if="loading">
      <b-col>
        <b-spinner label="Loading..."></b-spinner>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col cols="12" v-if="event.description">
        <dl>
          <dt>{{ $t("description") }}</dt>
          <dd>{{ event.description }}</dd>
        </dl>
      </b-col>
      <b-col cols="12" md="6" v-if="event.web_page">
        <dl>
          <dt>{{ $t("event.web_page") }}</dt>
          <dd>
            <a :href="event.web_page">{{ event.web_page }}</a>
          </dd>
        </dl>
      </b-col>
      <b-col cols="12" md="6" v-if="event.invitation">
        <dl>
          <dt>{{ $t("event.invitation") }}</dt>
          <dd>
            <a :href="event.invitation">{{ event.invitation }}</a>
          </dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("date") }}</dt>
          <dd v-if="event.date_start === event.date_end">
            {{ event.date_start }}
          </dd>
          <dd v-else>{{ event.date_start }} - {{ event.date_end }}</dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("organizer") }}</dt>
          <dd v-if="event.organization_info">
            {{ event.organization_info.name }}
          </dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("location") }}</dt>
          <dd>{{ event.location }}</dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3" v-if="$store.state.user.is_staff">
        <dl>
          <dt>{{ $t("competition.status") }}</dt>
          <dd v-if="event.locked">
            {{ $t("competition.locked") }}
            <b-button
              size="sm"
              variant="outline-success"
              v-on:click="toggleLockStatus()"
              v-if="$store.state.editMode"
            >
              {{ $t("competition.unlock") }}
            </b-button>
          </dd>
          <dd v-if="!event.locked">
            {{ $t("competition.unlocked") }}
            <b-button
              size="sm"
              variant="outline-danger"
              v-on:click="toggleLockStatus()"
              v-if="$store.state.editMode"
            >
              {{ $t("competition.lock") }}
            </b-button>
          </dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3" v-if="$store.state.user.is_authenticated">
        <dl>
          <dt>{{ $t("competition.visibility") }}</dt>
          <dd v-if="event.public">
            {{ $t("competition.public") }}
            <b-button
              size="sm"
              variant="outline-success"
              v-on:click="togglePublicStatus()"
              v-if="$store.state.editMode"
            >
              {{ $t("competition.hide") }}
            </b-button>
          </dd>
          <dd v-if="!event.public">
            {{ $t("competition.hidden") }}
            <b-button
              size="sm"
              variant="outline-danger"
              v-on:click="togglePublicStatus()"
              v-if="$store.state.editMode"
            >
              {{ $t("competition.publish") }}
            </b-button>
          </dd>
        </dl>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Displays information for the single event
 *
 * Extra information is displayed based on user's permissions and edit mode
 */
import { HTTP } from "../api/BaseApi.js";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";

export default {
  name: "Event",
  data() {
    return {
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      errors: {},
      event: {},
      loading: true
    };
  },
  computed: {
    /**
     * Set edit permissions boolean based on event permissions info
     *
     * @returns {boolean} editPermission
     */
    editPermission: function() {
      try {
        this.$emit("update:createPermission", this.event.permissions.update);
        return this.event.permissions.update;
      } catch (err) {
        return false;
      }
    }
  },
  mounted() {
    this.getEvent(this.$route.params.event_id);
  },
  methods: {
    /**
     * Fetch event information from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getEvent(id) {
      this.event = {};
      this.loading = true;
      HTTP.get("events/" + id + "/")
        .then(response => {
          this.event = response.data || {};
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loading = false));
    },
    /**
     * Set event lock status (API patch)
     *
     * @returns {Promise<void>}
     */
    toggleLockStatus: async function() {
      this.$set(this.errors, "main", null);
      await HTTP.patch(
        "events/" + this.event.id + "/",
        { locked: !this.event.locked },
        this.config
      )
        .then(response => {
          this.event.locked = response.data.locked;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Set event public status (API patch)
     *
     * @returns {Promise<void>}
     */
    togglePublicStatus: async function() {
      this.$set(this.errors, "main", null);
      await HTTP.patch(
        "events/" + this.event.id + "/",
        { public: !this.event.public },
        this.config
      )
        .then(response => {
          this.event.public = response.data.public;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    }
  }
};
</script>

<style scoped></style>
