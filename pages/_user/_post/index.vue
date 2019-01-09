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
        <div class="post">
          <h1>Post Title</h1>
          <p>Post content</p>
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
  async asyncData({ params, error }) {
    return blockstack
      .lookupProfile(params.user)
      .then(res => {
        return {
          user: res.account[0].identifier,
          propic: res.image[0].contentUrl,
          loading: false,
          bio: "Loading bio...",
          remote: true
        };
      })
      .catch(err => {
        error({ message: "user not found", statusCode: 404 });
      });
  },
  mounted() {
    console.log(this);
  }
};
</script>

<style scoped>
.user {
  text-align: center;
  margin-top: 100px;
  font-family: sans-serif;
}
</style>
