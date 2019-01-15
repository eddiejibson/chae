<template>
  <div id="offcanvas-nav" uk-offcanvas="overlay: true">
    <div class="uk-offcanvas-bar">
      <ul class="uk-nav uk-nav-default">
        <li class="uk-nav-header">Chae</li>
        <li @click.prevent="signIn" v-if="!username">
          <a href="#">
            <span class="uk-margin-small-right" uk-icon="icon: sign-in"></span> Sign in
          </a>
        </li>
        <li v-if="username">
          <nuxt-link to="/post">
            <span class="uk-margin-small-right" uk-icon="icon: pencil"></span> New post
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/search">
            <span class="uk-margin-small-right" uk-icon="icon: search"></span> Search Users
          </nuxt-link>
        </li>
        <li>
          <nuxt-link :to="'/'+username+'/'" v-if="username">
            <span class="uk-margin-small-right" uk-icon="icon: user"></span> My Profile
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/drafts" v-if="username">
            <span class="uk-margin-small-right" uk-icon="icon: file-edit"></span> Drafts
          </nuxt-link>
        </li>
        <li v-if="username">
          <nuxt-link to="/options">
            <span class="uk-margin-small-right" uk-icon="icon: cog"></span> Options
          </nuxt-link>
        </li>
        <li class="uk-nav-divider"></li>
        <li>
          <a href="#">
            <span class="uk-margin-small-right" uk-icon="icon: heart"></span> Donate
          </a>
        </li>
        <li>
          <a href="#">
            <span class="uk-margin-small-right" uk-icon="icon: lifesaver"></span> Support
          </a>
        </li>
        <li>
          <a href="https://github.com/eddiejibson/chae/">
            <span class="uk-margin-small-right" uk-icon="icon: github"></span> GitHub
          </a>
        </li>
        <li class="uk-nav-divider" v-if="username"></li>
        <li @click.prevent="signOut" v-if="username">
          <a href="#">
            <span class="uk-margin-small-right" uk-icon="icon: sign-out"></span> Sign out
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    signOut(e) {
      this.$signOut();
    },
    signIn() {
      this.$signIn();
    }
  },
  data() {
    return {
      username: null
    };
  },
  mounted() {
    this.username = localStorage.getItem("username");
  }
};
</script>