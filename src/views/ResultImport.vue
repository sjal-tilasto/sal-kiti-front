<template>
  <div class="import">
    <Competition />
    <ResultImport />
  </div>
</template>

<script>
/**
 * Result import view
 */
import Competition from "@/components/CompetitionInformation.vue";
import ResultImport from "@/components/ResultImport.vue";

export default {
  name: "ResultImportView",
  components: {
    Competition,
    ResultImport
  },
  created() {
    document.title =
      this.$t("title.result_import") + " | " + this.$t("title.prefix");
  }
};
</script>
