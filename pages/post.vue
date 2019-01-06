<template>
  <div class="uk-flex uk-flex-center">
    <div class="uk-width-1-2@m uk-margin">
      <input
        class="uk-input"
        v-bind:class="{ 'margin-bottom': !slugInfo }"
        type="text"
        placeholder="Title"
        @input.prevent="updateTitle($event)"
        :value="title"
      >
      <div class="slug-info" v-if="slugInfo">
        <div>
          <p>https://chae.sh/{{ this.userData.username }}/{{ this.slug }}</p>
          <p class="slug-edit" @click.prevent="editSlug">(change)</p>
        </div>
        <p v-if="lastEditedBool">Last edited: 2 hours ago</p>
      </div>
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
      title: null,
      needsPublish: true,
      timeout: 0,
      slugInfo: false,
      lastEditedBool: false,
      slug: null,
      userData: null,
      update: false
    };
  },
  mounted() {
    this.$requireSignIn(this.$router);
    UIkit.offcanvas("#offcanvas-nav").hide();
    this.timeout = null;
    this.userData = this.$getProfile(false);
  },
  methods: {
    updatePostBody(e) {
      this.post = e.target.value;
      this.characters = this.$characterCounter(e);
      this.savedStatus = "Waiting for user to finish typing...";
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.$saveDraft(e.target.value).then(res => {
          this.savedStatus = "Saved Draft.";
          this.title = res.title;
        });
      }, 800);
    },
    updateTitle(e) {
      this.title = e.target.value;
    },
    updatePost() {
      let pubOrUpd = this.updateOrPublish;
      if (pubOrUpd.toLowerCase().substr(-1) == "e") {
        pubOrUpd = pubOrUpd.substr(0, pubOrUpd.length - 1);
      }
      this.updateOrPublish = `${pubOrUpd}ing...`;
      this.$updatePost(
        this.post,
        this.title || null,
        this.slug || null,
        this.update || false
      ).then(res => {
        if (res) {
          this.update = true;
          this.updateOrPublish = `${pubOrUpd}ed.`;
          this.title = res.title || this.title;
          this.savedStatus = `${pubOrUpd}ed.`;
          if (res.slug) {
            this.slug = res.slug;
            this.slugInfo = true;
            history.pushState(
              {},
              this.title,
              `${window.location.origin}/${this.userData.username}/${this.slug}`
            );
          }

          setTimeout(() => {
            this.updateOrPublish = "Update";
          }, 800);
        }
      });
    },
    hideSlug() {
      this.slugInfo = false;
    }
  }
};
</script>