<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t("statistics.statistics") }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          variant="light"
          class="btn-orange space-right space-down"
          :to="{ name: 'statistics-search' }"
        >
          {{ $t("statistics.search") }}
        </b-button>
        <!-- <b-button
          variant="light"
          class="btn-orange space-right space-down"
          :to="{ name: 'records' }"
        >
          {{ $tc("nav.record", 2) }}
        </b-button> -->
        <b-button
          variant="light"
          class="btn-orange space-right space-down"
          :to="{ name: 'statistics-links' }"
        >
          {{ $tc("statistics.qualification", 2) }}
        </b-button>
        <b-button
          variant="light"
          class="btn-orange space-right space-down"
          :to="{ name: 'statistics-ranking' }"
        >
          {{ $t("sjal.ranking") }}
        </b-button>
        <b-button
          variant="light"
          class="btn-orange space-right space-down"
          :to="{ name: 'divari' }"
        >
          {{ $t("sjal.divari.divari") }}
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Statistics search view
 */

export default {
  name: "StatisticsView",
  created() {
    document.title =
      this.$t("title.statistics") + " | " + this.$t("title.prefix");
  }
};
</script>

<style scoped></style>
