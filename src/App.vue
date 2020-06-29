<template>
  <div>
    <nav>
      <TheNavbar />
    </nav>
    <main>
      <b-container>
        <router-view />
      </b-container>
    </main>
  </div>
</template>

<script>
import TheNavbar from "@/components/TheNavbar.vue";
export default {
  name: "app",
  components: {
    TheNavbar
  },
  mounted() {
    this.$store.dispatch("userInfo");
  },
  created() {
    document.title = this.$t("title.prefix");
  }
};
</script>
<style lang="scss">
@import "../node_modules/bootstrap/scss/bootstrap.scss";
@import "../node_modules/bootstrap-vue/src/index.scss";
@import "assets/sjal.scss";
</style>
