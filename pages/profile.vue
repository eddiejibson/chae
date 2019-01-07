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
import * as blockstack from "blockstack";
export default {
  async asyncData({ params, error }) {
    let lookup;
    if (!params.user) {
      return {
        remote: false,
        lookup: false,
        user: "",
        propic: "",
        bio: "I don't have a bio, yet.",
        loading: true
      };
    } else {
      lookup = String(params.user);
      return blockstack
        .lookupProfile(lookup)
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
    }
  },
  // data() {
  //   return {
  //     // items: [
  //     //   {
  //     //     message: "fag",
  //     //     bigMessage: "bigfag"
  //     //   }
  //     // ]
  //   };
  // },
  mounted() {
    console.log(this);
    if (!this.remote) {
      this.$requireSignIn(this.$router);
      var res = this.$getProfile();
      this.user = res.account[0].identifier;
      this.propic = res.image[0].contentUrl;
      this.loading = false;
      this.$getOptions("bio")
        .then(res => {
          if (res) {
            this.bio = res.content;
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>