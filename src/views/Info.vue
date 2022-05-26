<template>
  <div class="home">
    <b-row>
      <b-col>
        <h1>{{ $t("info.info") }}</h1>
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
    <div v-if="$store.state.user.is_staff">
      <h1>{{ $t("info.management") }}</h1>
      <div v-for="item in cardListStaff" v-bind:key="item.title">
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
 * Info view
 */

export default {
  name: "InfoView",
  computed: {
    /**
     * Sets card information for the info page
     *
     * @returns {array} card information
     */
    cardList: function () {
      return [
        {
          title: this.$tc("info.sport", 2),
          text: this.$t("info.sport_description"),
          button: this.$t("info.to_sport"),
          link: "info-sport"
        },
        {
          title: this.$tc("info.organization", 2),
          text: this.$t("info.organization_description"),
          button: this.$t("info.to_organization"),
          link: "info-organization"
        }
      ];
    },
    /**
     * Sets card information for the staff
     *
     * @returns {array} admin card information
     */
    cardListStaff: function () {
      return [
        {
          title: this.$tc("info.athlete_import", 2),
          text: this.$t("info.athlete_import_description"),
          button: this.$t("info.to_athlete_import"),
          link: "athlete-import"
        }
      ];
    }
  },
  created() {
    document.title = this.$t("title.info") + " | " + this.$t("title.prefix");
  }
};
</script>
