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
        <div v-for="(post, key) in posts" :key="post.title" :data-slug="key">
          <nuxt-link :to="'/'+username+'/'+key+'/'" class="nuxt-link">
            <div class="post">
              <div class="top-post">
                <h1 :data-slug="key">{{ post.title }}</h1>
                <div class="post-actions">
                  <span
                    uk-icon="icon: pencil"
                    class="post-actions-icon"
                    uk-tooltip="Edit Post"
                    @click.prevent="sendToUpdate(key)"
                  ></span>
                  <span
                    uk-icon="icon: trash"
                    class="post-actions-icon"
                    uk-tooltip="Delete Post"
                    @click.prevent="deletePost(key)"
                  ></span>
                </div>
              </div>

              <p>{{ post.content }}</p>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as blockstack from "blockstack";
export default {
  validate({ params }) {
    return true;
  },
  data() {
    return {
      user: "Loading username...",
      bio: "Loading bio...",
      propic: "https://cdn.chae.sh/img/icons/icon.png",
      posts: {},
      userPosts: null,
      loading: true,
      username: null,
      toast: null,
      successNoise: null
    };
  },
  mounted() {
    UIkit.offcanvas("#offcanvas-nav").hide();
    this.toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      customClass: "mixin",
      timer: 3000,
      padding: null
    });
    this.$lookupProfile(this.$route.params.user)
      .then(profile => {
        this.username = this.$route.params.user;
        if (profile) {
          this.user = profile.name;
          this.propic = profile.image[0].contentUrl;
          this.loading = false;
          this.$getFileContents("options.json", this.$route.params.user)
            .then(options => {
              if (options.bio) {
                this.bio = options.bio.content;
              } else {
                this.bio = "I haven't a bio, yet.";
              }
            })
            .catch(err => {
              this.bio = "I haven't a bio, yet.";
            });
          this.$getFileContents("posts.json", this.$route.params.user).then(
            posts => {
              if (posts && Object.keys(posts).length > 0) {
                this.posts = this.$sortPostsByDate(posts);
              } else {
                this.posts = false;
              }
            }
          );
        } else {
          this.$nuxt.error({ statusCode: 404, message: "user not found" });
        }
      })
      .catch(err => {
        console.error(err);
        this.$nuxt.error({ statusCode: 404, message: "user not found" });
      });
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
          this.$deletePost(slug)
            .then(res => {
              if (res.posts) {
                this.posts = res.posts;
                if (Object.keys(this.posts).length == 0) {
                  this.posts = false;
                }
                this.toast({
                  type: "success",
                  title: "Deleted post successfully",
                  background: "#2B2C31"
                });
              }
            })
            .catch(err => {
              console.error("Error deleting post", err);
            });
        }
      });
    }
  }
};
</script>

