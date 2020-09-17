<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t("statistics.statistics") }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">{{ $t("statistics.search") }}</h2>
        <StatisticsForm />
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Statistics search view
 */
import StatisticsForm from "@/components/StatisticsForm.vue";

export default {
  name: "StatisticsView",
  components: {
    StatisticsForm
  },
  created() {
    document.title =
      this.$t("title.statistics") + " | " + this.$t("title.prefix");
  }
};
</script>

<style scoped></style>
