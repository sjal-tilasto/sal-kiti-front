<template>
  <div class="home">
    <b-row>
      <b-col>
        <h1>{{ $t("front.header") }}</h1>
        <p>{{ $t("front.description") }}</p>
      </b-col>
    </b-row>
    <div v-for="item in cardList" v-bind:key="item.title">
      <h2 class="bg-sal-orange">
        {{ item.title }}
      </h2>
      <p>{{ item.text }}</p>
      <b-button
        variant="light"
        class="btn-orange space-right space-down"
        :to="{ name: item.link }"
      >
        {{ item.button }}
      </b-button>
    </div>
    <div v-if="$store.state.user.is_authenticated">
      <div v-for="item in cardListAuthenticated" v-bind:key="item.title">
        <h2 class="bg-sal-orange">
          {{ item.title }}
        </h2>
        <p>{{ item.text }}</p>
        <b-button
          variant="light"
          class="btn-orange space-right space-down"
          :to="{ name: item.link }"
        >
          {{ item.button }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Front page view
 */
export default {
  name: "HomeView",
  computed: {
    /**
     * Sets card information for the front page
     *
     * @returns {array} card information
     */
    cardList: function () {
      return [
        {
          title: this.$tc("nav.event", 2),
          text: this.$t("front.events_description"),
          button: this.$t("front.to_events"),
          link: "events"
        },
        {
          title: this.$tc("nav.competition", 2),
          text: this.$t("front.competitions_description"),
          button: this.$t("front.to_competitions"),
          link: "competition-search"
        },
        {
          title: this.$tc("nav.statistic", 2),
          text: this.$t("front.statistics_description"),
          button: this.$t("front.to_statistics"),
          link: "statistics"
        },
        {
          title: this.$tc("nav.record", 2),
          text: this.$t("front.records_description"),
          button: this.$t("front.to_records"),
          link: "records"
        },
        {
          title: this.$tc("nav.athlete", 2),
          text: this.$t("front.athletes_description"),
          button: this.$t("front.to_athletes"),
          link: "athlete-search"
        }
      ];
    },
    /**
     * Sets card information for the authenticated users
     *
     * @returns {array} card information
     */
    cardListAuthenticated: function () {
      return [
        {
          title: this.$tc("nav.info", 2),
          text: this.$t("front.info_description"),
          button: this.$t("front.to_info"),
          link: "info"
        }
      ];
    }
  },
  created() {
    document.title =
      this.$t("title.front_page") + " | " + this.$t("title.prefix");
  }
};
</script>
