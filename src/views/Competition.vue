<template>
  <div class="competition">
    <b-row>
      <b-col>
        <h1>{{ $tc("competition.competition", 1) }}: {{ competition.name }}</h1>
      </b-col>
      <b-col v-if="editPermission && $store.state.editMode">
        <b-button
          :to="{
            name: 'competition-update',
            params: {
              event_id: competition.event,
              competition_id: competition.id
            }
          }"
          variant="light"
          class="btn-orange float-right"
          >{{ $tc("competition.edit", 2) }}
        </b-button>
      </b-col>
    </b-row>
    <Competition
      v-on:update:editPermission="editPermission = $event"
      v-on:update:competition="competition = $event"
    />
    <Results
      v-bind:competition="competition"
      v-bind:editPermission="editPermission"
    />
  </div>
</template>

<script>
/**
 * Competition information and results view
 */
import Competition from "@/components/CompetitionInformation.vue";
import Results from "@/components/CompetitionResults.vue";

export default {
  name: "CompetitionView",
  components: {
    Competition,
    Results
  },
  data() {
    return {
      competition: {},
      editPermission: false
    };
  },
  created() {
    document.title =
      this.$t("title.competition") + " | " + this.$t("title.prefix");
  }
};
</script>
