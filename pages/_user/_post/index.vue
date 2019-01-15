<template>
  <!-- <span v-html="content"></span> -->
  <div class="uk-flex uk-flex-center uk-flex-column uk-flex-middle">
    <div class="page-loader" v-if="loading">
      <div uk-spinner></div>
      <p>Loading Post</p>
    </div>
    <div class="post-content uk-card uk-card-default uk-card-body uk-width-1-2@m" v-if="!loading">
      <div class="profile-top">
        <div class="uk-flex uk-flex-row uk-flex-middle">
          <div class="post-pro-pic profile-picture">
            <img :src="propic">
          </div>
          <div class="post-info">
            <h3 class="uk-card-title">{{ title }}</h3>
            <p class="bio">By {{ user }}</p>
          </div>
        </div>
      </div>
      <div class="post-content" v-html="content"></div>
    </div>
  </div>
</template>

<script>
import marked from "marked";
marked.setOptions({
  highlight: function(code) {
    return require("highlight.js").highlightAuto(code).value;
  }
});
export default {
  data() {
    return {
      user: null,
      title: null,
      content: "<p>Loading post content...</p>",
      loading: true,
      propic: "https://i.imgur.com/itElfV3.jpg"
    };
  },
  mounted() {
    this.$lookupProfile(String(this.$route.params.user)).then(profile => {
      this.user = String(profile.name);
      this.propic = String(profile.image[0].contentUrl);
    });
    this.$getFileContents("posts.json", this.$route.params.user).then(posts => {
      let post = posts[this.$route.params.post];
      if (post) {
        this.title = String(post.title);
        if (post.content) {
          this.content = marked(post.content);
        }
        this.loading = false;
      } else {
        console.error("Post not found, taking to user's profile");
        // this.$router.push(`/${this.$route.params.user}`);
      }
    });
  }
};
</script>