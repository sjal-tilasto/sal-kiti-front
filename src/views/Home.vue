<template>
  <div class="home">
    <b-row>
      <b-col>
        <h1>{{ $t("front.header") }}</h1>
        <p>{{ $t("front.description") }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col col md="12" lg="8">
        <h2 class="bg-sal-orange">{{ $tc("event.event", 2) }}</h2>
        <EventList :limit="8" :limited="true" />
      </b-col>
      <b-col>
        <b-row>
          <b-col>
            <h2 class="bg-sal-orange">
              {{ $t("sjal.recurve") }} {{ $t("sjal.ranking") }}
            </h2>
            <StatisticsRanking
              division="recurve"
              :dateStart="dateStart"
              :dateEnd="dateEnd"
              :limit="5"
              :limited="true"
            />
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'recurve', year: year }
              }"
              >{{ $t("sjal.full_ranking") }}</b-link
            >
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h2 class="bg-sal-orange">
              {{ $t("sjal.compound") }} {{ $t("sjal.ranking") }}
            </h2>
            <StatisticsRanking
              division="compound"
              :dateStart="dateStart"
              :dateEnd="dateEnd"
              :limit="5"
              :limited="true"
            />
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'compound', year: year }
              }"
              >{{ $t("sjal.full_ranking") }}</b-link
            >
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h2 class="bg-sal-orange">
              {{ $t("sjal.barebow") }} {{ $t("sjal.ranking") }}
            </h2>
            <StatisticsRanking
              division="barebow"
              :dateStart="dateStart"
              :dateEnd="dateEnd"
              :limit="5"
              :limited="true"
            />
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'barebow', year: year }
              }"
              >{{ $t("sjal.full_ranking") }}</b-link
            >
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import EventList from "@/components/EventList.vue";
import StatisticsRanking from "@/components/StatisticsRanking.vue";

/**
 * Front page view
 */
export default {
  name: "HomeView",
  components: {
    EventList,
    StatisticsRanking
  },
  computed: {
    year: function() {
      let date = new Date();
      if (date.getMonth() < 10) {
        return date.getFullYear() - 1;
      } else {
        return date.getFullYear();
      }
    },
    dateStart: function() {
      let date = new Date();
      let year = 0;
      if (date.getMonth() < 10) {
        year = date.getFullYear() - 1;
      } else {
        year = date.getFullYear();
      }
      if (year === 2020) {
        return (year + 1).toString() + "-05-01";
      }
      return year.toString() + "-10-01";
    },
    dateEnd: function() {
      let date = new Date();
      let year = 0;
      if (date.getMonth() < 10) {
        year = date.getFullYear();
      } else {
        year = date.getFullYear() + 1;
      }
      return year.toString() + "-09-01";
    }
  },
  created() {
    document.title =
      this.$t("title.front_page") + " | " + this.$t("title.prefix");
  }
};
</script>
