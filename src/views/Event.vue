<template>
  <div class="event">
    <Event v-on:update:createPermission="createPermission = $event" />
    <CompetitionList
      v-bind:createPermission="createPermission"
    ></CompetitionList>
  </div>
</template>

<script>
/**
 * Event information view
 */
import CompetitionList from "@/components/CompetitionList.vue";
import Event from "@/components/EventInformation.vue";

export default {
  name: "EventView",
  data() {
    return {
      createPermission: false
    };
  },
  components: {
    Event,
    CompetitionList
  },
  created() {
    document.title = this.$t("title.event") + " | " + this.$t("title.prefix");
  }
};
</script>
