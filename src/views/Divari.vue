<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t("statistics.statistics") }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <DivariForm />
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Divari Form
 */
import DivariForm from "@/components/DivariForm.vue";

export default {
  name: "DivariView",
  components: {
    DivariForm
  },
  created() {
    document.title =
      this.$t("title.statistics") + " | " + this.$t("title.prefix");
  }
};
</script>

<style scoped></style>
