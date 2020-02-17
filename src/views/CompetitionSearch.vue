<template>
  <div class="search">
    <CompetitionSearch />
  </div>
</template>

<script>
/**
 * Competition search view
 */
import CompetitionSearch from "@/components/CompetitionSearch.vue";

export default {
  name: "CompetitionSearchView",
  components: {
    CompetitionSearch
  },
  created() {
    document.title = this.$t("title.search") + " | " + this.$t("title.prefix");
  }
};
</script>
