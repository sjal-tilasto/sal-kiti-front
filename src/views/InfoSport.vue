<template>
  <div class="home">
    <InfoSport />
  </div>
</template>

<script>
/**
 * Info view
 */
import InfoSport from "@/components/InfoSport.vue";

export default {
  name: "InfoSportView",
  components: {
    InfoSport
  },
  created() {
    document.title = this.$t("title.sports") + " | " + this.$t("title.prefix");
  }
};
</script>
