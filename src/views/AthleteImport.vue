<template>
  <div class="import">
    <AthleteImport />
  </div>
</template>

<script>
/**
 * Result import view
 */
import AthleteImport from "@/components/AthleteImport.vue";

export default {
  name: "AthleteImportView",
  components: {
    AthleteImport
  },
  created() {
    document.title =
      this.$t("title.athlete_import") + " | " + this.$t("title.prefix");
  }
};
</script>
