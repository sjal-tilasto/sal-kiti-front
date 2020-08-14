<template>
  <div>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">{{ $t("competition.info") }}</h2>
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
    <b-row v-if="loadingCompetition">
      <b-col>
        <b-spinner label="Loading..."></b-spinner>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" v-if="competition.description">
        <dl>
          <dt>{{ $t("description") }}</dt>
          <dd>{{ competition.description }}</dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("date") }}</dt>
          <dd v-if="competition.date_start === competition.date_end">
            {{ competition.date_start }}
          </dd>
          <dd v-else>
            {{ competition.date_start }} - {{ competition.date_end }}
          </dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $tc("event.event", 1) }}</dt>
          <dd v-if="competition.event">
            <router-link
              tag="a"
              :to="{
                name: 'event',
                params: {
                  event_id: competition.event
                }
              }"
              >{{ competition.event_info.name }}</router-link
            >
          </dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("competition.type") }}</dt>
          <dd v-if="competition.type_info">{{ competition.type_info.name }}</dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("competition.level") }}</dt>
          <dd v-if="competition.level_info">
            {{ competition.level_info.name }}
          </dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("organizer") }}</dt>
          <dd v-if="competition.organization_info">
            {{ competition.organization_info.name }}
          </dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("location") }}</dt>
          <dd>{{ competition.location }}</dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3" v-if="$store.state.user.is_staff">
        <dl>
          <dt>{{ $t("competition.status") }}</dt>
          <dd v-if="competition.locked">
            {{ $t("competition.locked") }}
            <b-button
              size="sm"
              variant="outline-danger"
              v-on:click="toggleLockStatus()"
              v-if="$store.state.editMode"
            >
              {{ $t("competition.unlock") }}
            </b-button>
          </dd>
          <dd v-if="!competition.locked">
            {{ $t("competition.unlocked") }}
            <b-button
              size="sm"
              variant="outline-success"
              v-on:click="toggleLockStatus()"
              v-if="$store.state.editMode"
            >
              {{ $t("competition.lock") }}
            </b-button>
          </dd>
        </dl>
      </b-col>
      <b-col
        cols="6"
        md="3"
        v-if="editPermission || $store.state.user.is_staff"
      >
        <dl>
          <dt>{{ $t("competition.visibility") }}</dt>
          <dd v-if="competition.public">
            {{ $t("competition.public") }}
            <b-button
              size="sm"
              variant="outline-danger"
              v-on:click="togglePublicStatus()"
              v-if="$store.state.editMode"
            >
              {{ $t("competition.hide") }}
            </b-button>
          </dd>
          <dd v-if="!competition.public">
            {{ $t("competition.hidden") }}
            <b-button
              size="sm"
              variant="outline-success"
              v-on:click="togglePublicStatus()"
              v-if="$store.state.editMode"
            >
              {{ $t("competition.publish") }}
            </b-button>
          </dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3" v-if="$store.state.user.is_staff">
        <dl>
          <dt>{{ $t("competition.trial") }}</dt>
          <dd v-if="competition.trial">
            {{ $t("yes") }}
            <b-button
              size="sm"
              variant="outline-danger"
              v-on:click="toggleTrialStatus()"
              v-if="$store.state.editMode"
            >
              {{ $t("cancel") }}
            </b-button>
          </dd>
          <dd v-if="!competition.trial">
            {{ $t("no") }}
            <b-button
              size="sm"
              variant="outline-success"
              v-on:click="toggleTrialStatus()"
              v-if="$store.state.editMode"
            >
              {{ $t("set") }}
            </b-button>
          </dd>
        </dl>
      </b-col>
      <b-col
        cols="6"
        md="3"
        v-if="$store.state.user.is_superuser && competition.id"
      >
        <dl>
          <dt>{{ $t("change_log") }}</dt>
          <dd>
            <b-button
              :to="{
                name: 'changelog',
                params: { model_name: 'competition', object_id: competition.id }
              }"
              variant="light"
              class="btn-orange"
              v-if="competition"
              >{{ $t("change_log") }}
            </b-button>
          </dd>
        </dl>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Displays information for the single competition
 *
 * Extra information is displayed based on user's permissions and edit mode
 */
import { HTTP } from "../api/BaseApi.js";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";

export default {
  name: "Competition",
  data() {
    return {
      competition: {},
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      errors: {},
      loadingCompetition: false
    };
  },
  computed: {
    /**
     * Set edit permissions boolean based on competition permissions info
     *
     * @returns {boolean} editPermission
     */
    editPermission: function() {
      try {
        this.$emit(
          "update:editPermission",
          this.competition.permissions.update
        );
        return this.competition.permissions.update;
      } catch (err) {
        return false;
      }
    }
  },
  mounted() {
    this.getCompetition(this.$route.params.competition_id);
  },
  methods: {
    /**
     * Fetch competition information from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getCompetition(id) {
      this.$set(this.errors, "main", null);
      this.competition = {};
      this.loadingCompetition = true;
      HTTP.get("competitions/" + id + "/")
        .then(response => {
          this.competition = response.data || {};
          this.$emit("update:competition", this.competition);
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingCompetition = false));
    },
    /**
     * Set competition lock status (API patch)
     *
     * @returns {Promise<void>}
     */
    toggleLockStatus: async function() {
      this.$set(this.errors, "main", null);
      await HTTP.patch(
        "competitions/" + this.competition.id + "/",
        { locked: !this.competition.locked },
        this.config
      )
        .then(response => {
          this.competition.locked = response.data.locked;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Set competition public status (API patch)
     *
     * @returns {Promise<void>}
     */
    togglePublicStatus: async function() {
      this.$set(this.errors, "main", null);
      await HTTP.patch(
        "competitions/" + this.competition.id + "/",
        { public: !this.competition.public },
        this.config
      )
        .then(response => {
          this.competition.public = response.data.public;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Set competition trial status (API patch)
     *
     * @returns {Promise<void>}
     */
    toggleTrialStatus: async function() {
      this.$set(this.errors, "main", null);
      await HTTP.patch(
        "competitions/" + this.competition.id + "/",
        { trial: !this.competition.trial },
        this.config
      )
        .then(response => {
          this.competition.trial = response.data.trial;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    }
  }
};
</script>

<style scoped></style>
