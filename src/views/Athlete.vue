<template>
  <div class="athlete">
    <Athlete />
    <Results />
  </div>
</template>

<script>
/**
 * Athlete information and results view
 */
import Athlete from "@/components/AthleteInformation.vue";
import Results from "@/components/AthleteResults.vue";

export default {
  name: "AthleteView",
  components: {
    Athlete,
    Results
  },
  created() {
    document.title = this.$t("title.athlete") + " | " + this.$t("title.prefix");
  }
};
</script>
