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
        <div class="no-posts" v-if="!posts">
          <h4 style="color: #bdc3c7;margin: 0;">{{ user }} hasn't authored any posts.</h4>
        </div>
        <!-- toggle will go here -->
        <div v-for="(post, slug) in posts" :key="slug" :data-slug="slug">
          <!-- This will be reused in a component, ik it's stupid rn. If anyone wants to do it for me i love you ty -->
          <nuxt-link :to="'/'+username+'/'+slug+'/'" class="nuxt-link">
            <div class="post">
              <div class="top-post">
                <div class="post-title">
                  <h1 :data-slug="slug">{{ post.title }}</h1>
                  <div class="badge" v-if="post.draft" style="margin-left: 10px;">draft</div>
                </div>
                <div class="post-actions" v-if="own">
                  <span
                    uk-icon="icon: pencil"
                    class="post-actions-icon"
                    uk-tooltip="Edit Post"
                    @click.prevent="sendToUpdate(slug)"
                  ></span>
                  <span
                    uk-icon="icon: trash"
                    class="post-actions-icon"
                    uk-tooltip="Delete Post"
                    @click.prevent="deletePost(slug, 'posts.json')"
                  ></span>
                </div>
              </div>
              <div class="preview-post" v-html="post.content"></div>
            </div>
          </nuxt-link>
        </div>
        <!-- -->
      </div>
    </div>
  </div>
</template>

<script>
import * as blockstack from "blockstack";
import marked from "marked";
marked.setOptions({
  highlight: function(code) {
    return require("highlight.js").highlightAuto(code).value;
  }
});
export default {
  validate({ params }) {
    return true;
  },
  data() {
    return {
      user: "user",
      bio: "Loading bio...",
      propic: "https://cdn.chae.sh/img/icons/icon.png",
      posts: {},
      drafts: {},
      userPosts: null,
      loading: true,
      username: null,
      toast: null,
      successNoise: null,
      own: true
    };
  },
  mounted() {
    if (UIkit) {
      UIkit.offcanvas("#offcanvas-nav").hide();
    }
    this.$lookupProfile(this.$route.params.user)
      .then(profile => {
        this.username = this.$route.params.user;
        if (profile) {
          this.user = profile.name;
          this.propic = profile.image[0].contentUrl;
          this.loading = false;
          this.$getFileContents("options.json", this.$route.params.user)
            .then(options => {
              if (options.bio && String(options.bio.content).length > 1) {
                this.bio = options.bio.content;
              } else {
                this.bio = "I haven't a chae status, yet.";
              }
            })
            .catch(err => {
              this.bio = "I haven't a chae status, yet.";
            });

          this.$getFileContents("posts.json", this.$route.params.user)
            .then(posts => {
              if (posts && Object.keys(posts).length > 0) {
                posts = this.$sortPostsByDate(posts);
                for (
                  let index = 0;
                  index < Object.keys(posts).length;
                  index++
                ) {
                  let i = Object.keys(posts)[index];
                  if (posts[i]) {
                    posts[i].content = posts[i].content.substr(0, 500);
                    posts[i].content = marked(posts[i].content);
                  }
                }
                this.posts = posts;
              } else {
                this.posts = false;
              }
            })
            .catch(err => {
              console.error("Error retrieving posts", err);
              this.posts = false;
            });
        } else {
          this.$nuxt.error({ statusCode: 404, message: "user not found" });
        }
      })
      .catch(err => {
        console.error(err);
        this.$nuxt.error({ statusCode: 404, message: "user not found" });
      });
    let username = localStorage.getItem("username"); //I will change this method it's stupid
    if (
      String(username).toLowerCase() ==
      String(this.$route.params.user).toLowerCase()
    ) {
      this.own = true;
    } else {
      this.own = false;
    }
  },
  methods: {
    sendToUpdate(slug) {
      this.$router.push(`/edit/${slug}`);
    },
    deletePost(slug) {
      Swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        background: "#2B2C31",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#ff4757",
        focusConfirm: false,
        confirmButtonColor: "#242528",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          this.$deletePost(slug, "posts.json")
            .then(res => {
              if (res.posts) {
                this.posts = res.posts;
                if (Object.keys(this.posts).length == 0) {
                  this.posts = false;
                }
                this.$sound("ok.wav");
                this.$toast("Deleted post successfully");
              }
            })
            .catch(err => {
              console.error("Error deleting post", err);
            });
        }
      });
    }
  },
  head() {
    return {
      titleTemplate: `${this.user} || chae.`
    };
  }
};
</script>

