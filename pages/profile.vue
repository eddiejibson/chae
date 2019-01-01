<template>
  <div class="uk-flex uk-flex-center uk-flex-column uk-flex-middle">
    <div class="page-loader" v-if="loading">
      <div uk-spinner></div>
      <p>Fetching data...</p>
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
          <h1>Post title</h1>
          <p>Post content</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: "Username",
      bio: "I don't have a bio...",
      propic: "",
      loading: true
    };
  },
  mounted() {
    this.$requireSignIn(this.$router);
    this.$lookupProfile("m1screant.id.blockstack");
    var res = this.$getProfile();
    this.user = res.account[0].identifier;
    this.propic = res.image[0].contentUrl;
    this.loading = false;
    this.$getOptions("bio")
      .then(res => {
        if (res) {
          this.bio = res;
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>