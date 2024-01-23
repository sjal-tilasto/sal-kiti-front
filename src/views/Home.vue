<template>
  <div class="home">
    <b-row>
      <b-col>
        <h1>{{ $t("front.header") }}</h1>
        <p>{{ $t("front.description") }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col col md="12" lg="12">
        <h2 class="bg-sal-orange">{{ $tc("event.event", 2) }}</h2>
        <EventList :limit="8" :limited="true" />
      </b-col>
    </b-row>
    <b-row>
      <b-col col md="12" lg="12">
        <h2 class="bg-sal-orange">{{ $t("sjal.ranking") }}</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-row>
          <b-col sm="12" md="6" lg="4">
            <h3 class="bg-sal-orange">
              {{ $t("sjal.recurve") }}
            </h3>
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'y', rolling: true }
              }"
              >{{ $t("sjal.full_ranking") }} Y</b-link
            >
            <StatisticsRanking
              division="y"
              :rolling="true"
              :limit="5"
              :limited="true"
            />
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'n', rolling: true }
              }"
              >{{ $t("sjal.full_ranking") }} N</b-link
            >
            <StatisticsRanking
              division="n"
              :rolling="true"
              :limit="5"
              :limited="true"
            />
          </b-col>
          <b-col sm="12" md="6" lg="4">
            <h3 class="bg-sal-orange">
              {{ $t("sjal.compound") }}
            </h3>
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'yt', rolling: true }
              }"
              >{{ $t("sjal.full_ranking") }} YT</b-link
            >
            <StatisticsRanking
              division="yt"
              :rolling="true"
              :limit="5"
              :limited="true"
            />
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'nt', rolling: true }
              }"
              >{{ $t("sjal.full_ranking") }} NT</b-link
            >
            <StatisticsRanking
              division="nt"
              :rolling="true"
              :limit="5"
              :limited="true"
            />
          </b-col>
          <b-col sm="12" md="6" lg="4">
            <h3 class="bg-sal-orange">
              {{ $t("sjal.barebow") }}
            </h3>
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'yv', rolling: true }
              }"
              >{{ $t("sjal.full_ranking") }} YV</b-link
            >
            <StatisticsRanking
              division="yv"
              :rolling="true"
              :limit="5"
              :limited="true"
            />
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'nv', rolling: true }
              }"
              >{{ $t("sjal.full_ranking") }} NV</b-link
            >
            <StatisticsRanking
              division="nv"
              :rolling="true"
              :limit="5"
              :limited="true"
            />
          </b-col>
          <b-col sm="12" md="6" lg="4">
            <h3 class="bg-sal-orange">
              {{ $t("sjal.longbow") }}
            </h3>
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'ylb', rolling: true }
              }"
              >{{ $t("sjal.full_ranking") }} YLB</b-link
            >
            <StatisticsRanking
              division="ylb"
              :rolling="true"
              :limit="5"
              :limited="true"
            />
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'nlb', rolling: true }
              }"
              >{{ $t("sjal.full_ranking") }} NLB</b-link
            >
            <StatisticsRanking
              division="nlb"
              :rolling="true"
              :limit="5"
              :limited="true"
            />
          </b-col>
          <b-col sm="12" md="6" lg="4">
            <h3 class="bg-sal-orange">
              {{ $t("sjal.traditional") }}
            </h3>
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'ytr', rolling: true }
              }"
              >{{ $t("sjal.full_ranking") }} YTR</b-link
            >
            <StatisticsRanking
              division="ytr"
              :rolling="true"
              :limit="5"
              :limited="true"
            />
            <b-link
              :to="{
                name: 'statistics-ranking',
                query: { division: 'ntr', rolling: true }
              }"
              >{{ $t("sjal.full_ranking") }} NTR</b-link
            >
            <StatisticsRanking
              division="ntr"
              :rolling="true"
              :limit="5"
              :limited="true"
            />
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
    year: function () {
      let date = new Date();
      let year = date.getFullYear();
      if (year <= 2022 && date.getMonth() < 5) {
        return 2020;
      }
      if (date.getMonth() < 10) {
        return date.getFullYear() - 1;
      } else {
        return date.getFullYear();
      }
    },
    dateStart: function () {
      return this.year.toString() + "-10-01";
    },
    dateEnd: function () {
      if (this.year === 2020) {
        return (this.year + 2).toString() + "-04-30";
      } else if (this.year === 2022) {
        return (this.year + 1).toString() + "-10-01";
      }
      return (this.year + 1).toString() + "-09-01";
    }
  },
  created() {
    document.title =
      this.$t("title.front_page") + " | " + this.$t("title.prefix");
  }
};
</script>
