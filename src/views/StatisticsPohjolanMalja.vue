<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t("statistics.statistics") }}</h1>
      </b-col>
    </b-row>
    <StatisticsPohjolanMalja />
  </div>
</template>

<script>
/**
 * Pohjolan malja statistics view
 */
import StatisticsPohjolanMalja from "@/components/StatisticsPohjolanMalja.vue";

export default {
  name: "StatisticsPohjolanMaljaView",
  components: {
    StatisticsPohjolanMalja
  },
  created() {
    document.title =
      this.$t("title.statistics") + " | " + this.$t("title.prefix");
  }
};
</script>

<style scoped></style>
