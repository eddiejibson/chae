<template>
  <!-- <span v-html="content"></span> -->
  <div class="uk-flex uk-flex-center uk-flex-column uk-flex-middle">
    <div class="page-loader" v-if="loading">
      <div uk-spinner></div>
      <p>Loading Content</p>
    </div>
    <div class="post-content uk-card uk-card-default uk-card-body uk-width-1-2@m" v-if="!loading">
      <h1>hi</h1>
    </div>
  </div>
</template>

<script>
import marked from "marked";
export default {
  data() {
    return {
      user: null,
      title: null,
      content: null,
      loading: false
    };
  },
  mounted() {
    this.content = marked(
      "# Marked in the browser\n\nRendered by **marked**.\n```javascript \nconsole.log('hi');\n```"
    );
  }
};
</script>