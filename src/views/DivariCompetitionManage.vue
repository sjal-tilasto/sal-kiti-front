<template>
  <div class="import">
    <b-row>
      <b-col>
        <h1>{{ $t("sjal.divari.competition_add") }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <DivariCompetitionForm />
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Result import view
 */
import DivariCompetitionForm from "@/components/DivariCompetitionForm.vue";

export default {
  name: "DivariCompetitionManage",
  components: {
    DivariCompetitionForm
  },
  created() {
    document.title =
      this.$t("title.result_import") + " | " + this.$t("title.prefix");
  }
};
</script>
