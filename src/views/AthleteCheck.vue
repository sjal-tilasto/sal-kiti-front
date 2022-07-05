<template>
  <div class="import">
    <AthleteCheck />
  </div>
</template>

<script>
/**
 * Result import view
 */
import AthleteCheck from "@/components/AthleteCheck.vue";

export default {
  name: "AthleteCheckView",
  components: {
    AthleteCheck
  },
  created() {
    document.title =
      this.$t("title.athlete_check") + " | " + this.$t("title.prefix");
  }
};
</script>
