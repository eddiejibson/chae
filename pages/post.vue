<template>
  <div class="uk-flex uk-flex-center">
    <div class="uk-width-1-2@m uk-margin">
      <input class="uk-input margin-bottom" type="text" placeholder="Title">
      <textarea
        class="uk-textarea"
        id="post-content"
        rows="5"
        placeholder="Write something spicy here"
        @input.prevent="updatePostBody($event)"
        :value="post"
      ></textarea>
      <div class="textarea-info">
        <p>{{ savedStatus }}</p>

        <p>{{ characters }} characters.</p>
      </div>
      <div class="bottom-post">
        <button
          class="uk-button uk-button-primary publish-btn"
          @click.prevent="updatePost"
        >{{ updateOrPublish }}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      characters: 0,
      savedStatus: "Nothing to save.",
      updateOrPublish: "Publish",
      post: "",
      needsPublish: true
    };
  },
  mounted() {
    this.$requireSignIn(this.$router);
    UIkit.offcanvas("#offcanvas-nav").hide();
  },
  methods: {
    updatePostBody(e) {
      this.post = e.target.value;
      this.characters = this.$characterCounter(e);
    },
    updatePost() {
      this.updateOrPublish = "Publishing...";
    }
  }
};
</script>