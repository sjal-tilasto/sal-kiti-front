<template>
  <div class="event">
    <ResultForm />
  </div>
</template>

<script>
/**
 * Result management view
 */
import ResultForm from "@/components/ResultForm.vue";

export default {
  name: "ResultManageView",
  components: {
    ResultForm
  },
  created() {
    document.title =
      this.$t("title.result_manage") + " | " + this.$t("title.prefix");
  }
};
</script>
