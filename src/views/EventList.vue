<template>
  <div class="home">
    <EventList />
  </div>
</template>

<script>
/**
 * Event list view
 */
import EventList from "@/components/EventList.vue";

export default {
  name: "EventListView",
  components: {
    EventList
  },
  created() {
    document.title = this.$t("title.events") + " | " + this.$t("title.prefix");
  }
};
</script>
