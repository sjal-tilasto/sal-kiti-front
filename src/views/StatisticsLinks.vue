<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t("statistics.statistics") }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <StatisticsLinks />
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Statistics search view
 */
import StatisticsLinks from "@/components/StatisticsLinks.vue";

export default {
  name: "StatisticsLinkView",
  components: {
    StatisticsLinks
  },
  created() {
    document.title =
      this.$t("title.statistics") + " | " + this.$t("title.prefix");
  }
};
</script>

<style scoped></style>
