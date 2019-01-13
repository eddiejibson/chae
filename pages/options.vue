<template>
  <div class="uk-flex uk-flex-center">
    <div class="uk-width-1-2@m uk-margin">
      <h3 class="h3-field">Update status</h3>
      <p class="last-edited">{{ lastEdited }}</p>
      <textarea
        class="uk-textarea"
        id="post-content"
        rows="5"
        placeholder="Write your chae status/bio here..."
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
    return {
      characters: 0,
      savedStatus: "No changes.",
      existingBio: "",
      lastEdited: "",
      lastEditedInt: 0,
      timeout: 0
    };
  },
  methods: {
    bio(e) {
      this.existingBio = e.target.value;
      this.characters = this.$characterCounter(e);
      this.savedStatus = "Waiting for user to finish typing...";
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.savedStatus = "Saving...";
        this.$saveOptions({
          bio: e
        })
          .then(res => {
            this.savedStatus = "Saved.";
            this.lastEdited = "Last edited: Just now.";
            this.lastEditedInt = Date.now();
          })
          .catch(err => {
            this.savedStatus = `Error saving: ${err}`;
          });
      }, 800);
    }
  },
  mounted() {
    this.$requireSignIn(this.$router);
    this.timeout = null;
    this.$getOptions("bio")
      .then(res => {
        if (res) {
          this.existingBio = res.content;
          this.characters = res.content.length; //undefined
          this.lastEditedInt = res.updated;
          this.lastEdited = "Last edited: " + this.$lastEdited(res.updated);
        }
      })
      .catch(err => {
        console.error(err);
      });
    setInterval(() => {
      if (this.lastEditedInt > 0) {
        console.log("Updating last edited");
        this.lastEdited =
          "Last edited: " + this.$lastEdited(this.lastEditedInt);
      }
    }, 1000 * 60);
    UIkit.offcanvas("#offcanvas-nav").hide();
  },
  head() {
    return {
      title: "options || chae."
    };
  }
};
</script>