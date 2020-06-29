<template>
  <div class="import">
    <DivariImportResults />
  </div>
</template>

<script>
/**
 * Result import view
 */
import DivariImportResults from "@/components/DivariImportResults.vue";

export default {
  name: "DivariImport",
  components: {
    DivariImportResults
  },
  created() {
    document.title =
      this.$t("title.result_import") + " | " + this.$t("title.prefix");
  }
};
</script>
