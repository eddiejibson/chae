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
          :class="{ disabled: disabled }"
          :disabled="disabled"
        >{{ updateOrPublish }}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      characters: 0,
      savedStatus: "Nothing to save.",
      updateOrPublish: "Publish",
      post: null,
      title: null,
      needsPublish: true,
      timeout: 0,
      slugInfo: false,
      lastEditedBool: false,
      slug: null,
      userData: null,
      update: false,
      disabled: false,
      draftSlug: null,
      editedSinceUpdate: false
    };
  },
  mounted() {
    this.$requireSignIn(this.$router);
    UIkit.offcanvas("#offcanvas-nav").hide();
    if (this.edit) {
      let file = "posts.json";
      if (this.$route.params.post.toLowerCase().substr(0, 6) == "draft-") {
        file = "drafts.json";
      }
      console.log(file);
      this.$getFileContents(file)
        .then(post => {
          if (post[this.$route.params.post]) {
            this.post = post[this.$route.params.post].content;
            this.title = post[this.$route.params.post].title;
            this.slugInfo = true;
            this.update = true;
            this.slug = this.$route.params.post;
            this.characters = this.post.length;
          } else {
            console.error(
              "Post could not be found with specified slug. Taking user to post page instead..."
            );
            this.$router.push("/post");
          }
        })
        .catch(err => {
          console.error(
            "Error retrieving posts. Taking user to post page instead...",
            err
          );
          this.$router.push("/post");
        });
      this.updateOrPublish = "Update";
    }
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
        this.$saveDraft(e.target.value, this.title, this.draftSlug)
          .then(res => {
            if (res) {
              this.savedStatus = "Saved Draft.";
              if (res.title) {
                this.title = res.title;
              } else if (res.slug) {
                this.draftSlug = res.slug;
              }
            } else {
              this.savedStatus = "Error saving draft :(";
            }
          })
          .catch(err => {
            console.error(err);
            this.savedStatus = "Error saving draft :(";
          });
      }, 800);
    },
    updateTitle(e) {
      this.title = e.target.value;
    },
    updatePost() {
      this.disabled = true;
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
          this.updateOrPublish = "Update";
          this.title = res.title || this.title;
          this.savedStatus = `${pubOrUpd}ed.`;
          this.$toast(`Post ${pubOrUpd}ed.`);
          this.$sound("ok.wav");
          if (res.slug) {
            this.slug = res.slug;
            this.slugInfo = true;
            if (!this.update) {
              this.update = true;
            }
          }
          this.disabled = false;
        }
      });
    },
    hideSlug() {
      this.slugInfo = false;
    },
    head() {
      return {
        title: "post || chae."
      };
    }
  }
};
</script>