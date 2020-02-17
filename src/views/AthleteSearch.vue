<template>
  <div class="search">
    <AthleteSearch />
  </div>
</template>

<script>
/**
 * Athlete search view
 */
import AthleteSearch from "@/components/AthleteSearch.vue";

export default {
  name: "AthleteSearchView",
  components: {
    AthleteSearch
  },
  created() {
    document.title = this.$t("title.search") + " | " + this.$t("title.prefix");
  }
};
</script>
