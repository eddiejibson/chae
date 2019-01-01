<template>
  <div id="offcanvas-nav" uk-offcanvas="overlay: true">
    <div class="uk-offcanvas-bar">
      <ul class="uk-nav uk-nav-default">
        <li class="uk-nav-header">Chae</li>
        <li>
          <nuxt-link to="/post">
            <span class="uk-margin-small-right" uk-icon="icon: pencil"></span>New post
          </nuxt-link>
        </li>
        <li>
          <a href="#">
            <span class="uk-margin-small-right" uk-icon="icon: search"></span>Search
          </a>
        </li>
        <li>
          <a href="#">
            <span class="uk-margin-small-right" uk-icon="icon: user"></span> My Profile
          </a>
        </li>
        <li>
          <nuxt-link to="/options">
            <span class="uk-margin-small-right" uk-icon="icon: cog"></span> Options
          </nuxt-link>
        </li>
        <li class="uk-nav-divider"></li>
        <li>
          <a href="#">
            <span class="uk-margin-small-right" uk-icon="icon: heart"></span>Donate
          </a>
        </li>
        <li>
          <a href="#">
            <span class="uk-margin-small-right" uk-icon="icon: lifesaver"></span>Support
          </a>
        </li>
        <li>
          <a href="#">
            <span class="uk-margin-small-right" uk-icon="icon: github"></span>GitHub
          </a>
        </li>
        <li class="uk-nav-divider"></li>
        <li>
          <a href="#">
            <span class="uk-margin-small-right" uk-icon="icon: sign-out"></span>Sign out
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {}
};
</script>