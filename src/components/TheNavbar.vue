<template>
  <div>
    <b-navbar toggleable="lg" type="dark" fixed="top">
      <b-navbar-brand to="/">
        <img class="logo-img" src="../assets/logo.png" alt="SAL" />
        {{ $t("nav.title") }}
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/events">{{ $tc("nav.event", 2) }}</b-nav-item>
          <b-nav-item to="/competition/search">{{
            $tc("nav.competition", 2)
          }}</b-nav-item>
          <b-nav-item to="/statistics">{{
            $tc("nav.statistic", 2)
          }}</b-nav-item>
          <b-nav-item to="/records">{{ $tc("nav.record", 2) }}</b-nav-item>
          <b-nav-item to="/athlete/search">{{
            $tc("nav.athlete", 2)
          }}</b-nav-item>
          <b-nav-item v-if="$store.state.user.is_authenticated" to="/info">{{
            $tc("nav.info", 2)
          }}</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item right>
            <b-button
              v-for="(lang, i) in langs"
              v-bind:key="i"
              variant="light"
              class="btn-sm btn-orange space-right"
              v-on:click="selectLang(lang)"
              :pressed="lang === $i18n.locale"
            >
              {{ lang }}
            </b-button>
          </b-nav-item>
          <b-nav-item v-if="$store.state.user.is_authenticated" right>
            <b-button
              size="sm"
              variant="outline-danger"
              v-on:click="toggleEditMode"
              v-if="$store.state.editMode"
            >
              {{ $t("nav.edit_off") }}
            </b-button>
            <b-button
              size="sm"
              variant="outline-success"
              v-on:click="toggleEditMode"
              v-else
            >
              {{ $t("nav.edit_on") }}
            </b-button>
          </b-nav-item>
          <b-nav-item
            v-if="$store.state.user.is_authenticated"
            right
            to="/logout"
          >
            {{ $t("nav.logout") }}
          </b-nav-item>
          <b-nav-item v-else right to="/login">
            {{ $t("nav.login") }}
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
/**
 * Displays navigation bar
 */
export default {
  name: "TheNavbar",
  data() {
    return {
      langs: ["en", "fi"]
    };
  },
  methods: {
    /**
     * Toggle edit mode variable in store
     */
    toggleEditMode() {
      this.$store.commit("toggleEditMode");
      if (this.$store.state.editMode) {
        localStorage.editMode = "on";
      } else {
        localStorage.editMode = "off";
      }
    },
    /**
     * Set language
     *
     * @param {string} lang
     */
    selectLang(lang) {
      this.$i18n.locale = lang;
      localStorage.locale = lang;
    }
  }
};
</script>

<style scoped></style>
