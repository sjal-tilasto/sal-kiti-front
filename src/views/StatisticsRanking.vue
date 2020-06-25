<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t("statistics.statistics") }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <StatisticsRankingForm />
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Statistics search view
 */
import StatisticsRankingForm from "@/components/StatisticsRankingForm.vue";

export default {
  name: "StatisticsRankingView",
  components: {
    StatisticsRankingForm
  },
  created() {
    document.title =
      this.$t("title.statistics") + " | " + this.$t("title.prefix");
  }
};
</script>

<style scoped></style>
