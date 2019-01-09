<template>
  <div class="uk-flex uk-flex-center uk-flex-column uk-flex-middle">
    <div class="page-loader" v-if="loading">
      <div uk-spinner></div>
      <p>Loading Content</p>
    </div>
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m" v-if="!loading">
      <div class="profile-top">
        <div class="uk-flex uk-flex-row">
          <div class="profile-picture">
            <img :src="propic">
          </div>
          <div class="profile-info">
            <h3 class="uk-card-title">{{ user }}</h3>
            <p class="bio">{{ bio }}</p>
          </div>
        </div>
      </div>
      <div class="posts uk-flex uk-flex-column">
        <div class="no-posts" v-if="!posts">
          <h4 style="color: #bdc3c7;margin: 0;">{{ user }} hasn't authored any posts.</h4>
        </div>
        <div class="post" v-for="post in posts" :key="post.title">
          <h1>{{ post.title }}</h1>
          <p>{{ post.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
import * as blockstack from "blockstack";
export default {
  validate({ params }) {
    return true;
  },
  data() {
    return {
      user: "Loading username...",
      bio: "Loading bio...",
      propic: "https://cdn.chae.sh/img/icons/icon.png",
      posts: null,
      loading: true
    };
  },
  mounted() {
    this.$lookupProfile(this.$route.params.user)
      .then(profile => {
        console.log(profile);
        if (profile) {
          this.user = profile.name;
          this.propic = profile.image[0].contentUrl;
          this.loading = false;
          this.$getFileContents("options.json", this.$route.params.user)
            .then(options => {
              if (options.bio) {
                this.bio = options.bio.content;
              } else {
                this.bio = "I haven't a bio, yet.";
              }
            })
            .catch(err => {
              this.bio = "I haven't a bio, yet.";
            });
          this.$getFileContents("posts.json", this.$route.params.user).then(
            posts => {
              console.log(posts);
              if (posts) {
                this.posts = posts;
              }
            }
          );
        } else {
          this.$nuxt.error({ statusCode: 404, message: "user not found" });
        }
      })
      .catch(err => {
        console.error(err);
        this.$nuxt.error({ statusCode: 404, message: "user not found" });
      });
  }
};
</script>

