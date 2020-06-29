<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t("sjal.divari.divari") }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <DivariCompetitionResults />
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Statistics search view
 */
import DivariCompetitionResults from "@/components/DivariCompetitionResults.vue";

export default {
  name: "DivariCompetition",
  components: {
    DivariCompetitionResults
  },
  created() {
    document.title =
      this.$t("title.statistics") + " | " + this.$t("title.prefix");
  }
};
</script>

<style scoped></style>
