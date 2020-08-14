<template>
  <div class="home">
    <InfoCompetitionType />
  </div>
</template>

<script>
/**
 * Info view
 */
import InfoCompetitionType from "@/components/InfoCompetitionType.vue";

export default {
  name: "InfoCompetitionTypeView",
  components: {
    InfoCompetitionType
  },
  created() {
    document.title = this.$t("title.sports") + " | " + this.$t("title.prefix");
  }
};
</script>
