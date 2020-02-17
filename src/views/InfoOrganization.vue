<template>
  <div class="home">
    <InfoOrganization />
  </div>
</template>

<script>
/**
 * Info view
 */
import InfoOrganization from "@/components/InfoOrganization.vue";

export default {
  name: "InfoOrganizationView",
  components: {
    InfoOrganization
  },
  created() {
    document.title =
      this.$t("title.organizations") + " | " + this.$t("title.prefix");
  }
};
</script>
