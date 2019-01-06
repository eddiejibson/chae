<template>
  <section class="container">
    <div>
      <logo/>
      <h1 class="title">chae</h1>
      <h2
        class="subtitle"
        @click.prevent="signIn"
      >Powerful, simple and decentralized documentation system</h2>
      <div class="links">
        <a href="https://nuxtjs.org/" target="_blank" class="button--green">Documentation</a>
        <a href="https://github.com/nuxt/nuxt.js" target="_blank" class="button--grey">GitHub</a>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from "~/components/Logo.vue";
import { mapMutations } from "vuex";
export default {
  layout: "default",
  components: {
    Logo
  },
  methods: {
    signIn() {
      this.$signIn();
    }
  },
  mounted() {
    this.$requireSignIn(this.$router);
  }
};
</script>


