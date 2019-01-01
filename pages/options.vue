<template>
  <div class="uk-flex uk-flex-center">
    <div class="uk-width-1-2@m uk-margin">
      <textarea
        class="uk-textarea"
        id="post-content"
        rows="5"
        placeholder="Write your bio here..."
        @input.prevent="bio($event)"
        :value="existingBio"
        ref="input"
      ></textarea>
      <div class="textarea-info">
        <p>{{ savedStatus }}</p>
        <p>{{ characters }} / 2000</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // props: {
  //   existingBio: {
  //     default: ""
  //   }
  // },
  data() {
    return { characters: 0, savedStatus: "No changes.", existingBio: "" };
  },
  methods: {
    bio(e) {
      this.existingBio = e.target.value;
      this.characters = this.$characterCounter(e);
      this.savedStatus = "Waiting for user to finish typing...";
      clearTimeout(window.timeout);
      window.timeout = setTimeout(() => {
        this.savedStatus = "Saving...";
        this.$saveOptions({
          bio: e
        })
          .then(res => {
            this.savedStatus = "Saved.";
          })
          .catch(err => {
            this.savedStatus = `Error saving: ${err}`;
          });
      }, 800);
    }
  },
  mounted() {
    this.$requireSignIn(this.$router);
    window.timeout = null;
    this.$getOptions("bio")
      .then(res => {
        this.existingBio = res;
        this.characters = res.length;
      })
      .catch(err => {
        console.error(err);
      });
    UIkit.offcanvas("#offcanvas-nav").hide();
  }
};
</script>