<template>
  <div class="records">
    <Records />
  </div>
</template>

<script>
/**
 * Records search view
 */
import Records from "@/components/RecordsForm.vue";

export default {
  name: "RecordsView",
  components: {
    Records
  },
  created() {
    document.title = this.$t("title.records") + " | " + this.$t("title.prefix");
  }
};
</script>
