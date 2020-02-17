<template>
  <div class="event">
    <Event v-on:update:createPermission="createPermission = $event" />
    <CompetitionForm />
  </div>
</template>

<script>
/**
 * Competition management view
 */
import CompetitionForm from "@/components/CompetitionForm.vue";
import Event from "@/components/EventInformation.vue";

export default {
  name: "CompetitionManageView",
  components: {
    CompetitionForm,
    Event
  },
  created() {
    document.title =
      this.$t("title.competition_manage") + " | " + this.$t("title.prefix");
  }
};
</script>
