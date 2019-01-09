<template>
  <div class="uk-flex uk-flex-center uk-flex-middle uk-flex-column">
    <div class="login-container" id="login-container">
      <p class="login-state" @click.prevent="test">You're not logged in...</p>
      <button class="uk-button uk-button-primary big-btn" @click.prevent="signIn">
        Sign
        in with
        Blockstack
      </button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    signIn() {
      this.$signIn();
    }
  },
  mounted() {
    this.$requireSignIn(this.$router)
      .then(res => {
        if (res) {
          let origin = window.location.origin;
          window.location.replace(`${origin}/${res}`);
          console.log(`${origin}/${res}`);
        } else {
        }
      })
      .catch(err => {
        console.error("Oh no", err);
      });
  }
};
</script>