<template>
  <div class="import">
    <ResultImportPelias />
  </div>
</template>

<script>
/**
 * Result import view
 */
import ResultImportPelias from "@/components/ResultImportPelias.vue";

export default {
  name: "ResultImportPeliasView",
  components: {
    ResultImportPelias
  },
  created() {
    document.title =
      this.$t("title.result_import") + " | " + this.$t("title.prefix");
  }
};
</script>
