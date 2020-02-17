<template>
  <div class="event">
    <EventForm />
  </div>
</template>

<script>
/**
 * Event management view
 */
import EventForm from "@/components/EventForm.vue";

export default {
  name: "EventManageView",
  components: {
    EventForm
  },
  created() {
    document.title =
      this.$t("title.event_manage") + " | " + this.$t("title.prefix");
  }
};
</script>
