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
          <p class="slug-edit" @click.prevent="triggerEditSlug">(change)</p>
        </div>
        <p v-if="lastEditedBool">Last edited: 2 hours ago</p>
      </div>
      <div v-if="isEditSlug" class="edit-slug">
        <div class="slug-root-url">
          <p>https://chae.sh/{{ this.userData.username }}/</p>
        </div>
        <div class="slug-inline uk-inline margin-bottom">
          <button
            class="uk-form-icon uk-form-icon-flip"
            @click.prevent="editSlug"
            uk-icon="icon: check"
          ></button>
          <input
            type="text"
            @input.prevent="updateEditedSlug($event)"
            :value="slug"
            class="slug-input uk-input"
          >
        </div>
      </div>
      <no-ssr>
        <mavon-editor
          @change="updatePostBody($event)"
          v-model="post"
          language="en"
          placeholder="Write something spicy here"
          :toolbars="mavonToolbars"
          ishljs="true"
        />
      </no-ssr>
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
import { mavonEditor } from "mavon-editor";
export default {
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mavonToolbars: {
        bold: true,
        italic: true,
        header: true,
        underline: false,
        strikethrough: true,
        mark: false,
        superscript: false,
        subscript: false,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: false,
        code: true,
        table: true,
        fullscreen: false,
        readmodel: false,
        htmlcode: true,
        help: false,
        undo: true,
        redo: true,
        trash: false,
        save: false,
        navigation: false,
        alignleft: false,
        aligncenter: false,
        alignright: false,
        subfield: false,
        preview: false
      },
      testVal: "",
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
      userData: {
        username: null
      },
      update: false,
      disabled: false,
      draftSlug: null,
      editedSinceUpdate: false,
      isEditSlug: false,
      editedSlug: null
    };
  },
  mounted() {
    this.$requireSignIn(this.$router);
    UIkit.offcanvas("#offcanvas-nav").hide();
    if (this.edit) {
      let file = "posts.json";
      let isPrivate = false;
      if (this.$route.params.post.toLowerCase().substr(0, 6) == "draft-") {
        file = "drafts.json";
        isPrivate = true;
      }
      console.log(file);
      this.$getFileContents(file, null, isPrivate)
        .then(post => {
          if (typeof post == "string") {
            post = JSON.parse(post);
          }
          if (post[this.$route.params.post]) {
            this.post = post[this.$route.params.post].content;
            this.title = post[this.$route.params.post].title;
            if (
              this.$route.params.post.toLowerCase().substr(0, 6) == "draft-"
            ) {
              this.slugInfo = false;
              this.update = false;
              this.draftSlug = this.$route.params.post;
            } else {
              this.slugInfo = true;
              this.update = true;
            }

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
      if (this.$route.params.post.toLowerCase().substr(0, 6) == "draft-") {
        this.updateOrPublish = "Publish";
      } else {
        this.updateOrPublish = "Update";
      }
    }
    this.timeout = null;
    this.userData = this.$getProfile(false);
  },
  methods: {
    updatePostBody(e) {
      if (e.length < 1) {
        return;
      }
      this.savedStatus = "Waiting for user to finish typing...";
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.$saveDraft(e, this.title, this.draftSlug)
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
    triggerEditSlug(e) {
      this.slugInfo = false;
      this.isEditSlug = true;
    },
    editSlug(e) {
      if (this.slug.toLowerCase() != this.editedSlug.toLowerCase()) {
        this.$changeSlug(this.slug, this.editedSlug)
          .then(res => {
            this.$toast("Slug has been changed");
            this.$sound("ok.wav");
            this.slug = res.slug;
            this.isEditSlug = false;
            this.slugInfo = true;
          })
          .catch(err => {
            this.$toast("Slug could not be changed", "error");
          });
      }
    },
    updateEditedSlug(e) {
      this.editedSlug = e.target.value;
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
          if (this.draftSlug) {
            this.$deletePost(this.draftSlug, "drafts.json", true)
              .then(res => {
                if (res) {
                  this.savedStatus = `Draft removed - public copy ${pubOrUpd}ed.`;
                }
              })
              .catch(err => {
                console.error("Error deleting draft", err);
              });
          }
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
        title: "post || chae.",
        link: [
          {
            rel: "stylesheet",
            href: "https://cdn.chae.sh/css/editor.css"
          }
        ]
      };
    }
  }
};
</script>

<style>
</style>