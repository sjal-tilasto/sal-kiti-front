<template>
  <div class="home">
    <b-row>
      <b-col>
        <h1>{{ $tc("event.event", 2) }}</h1>
      </b-col>
    </b-row>
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
