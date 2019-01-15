<template>
  <div class="uk-flex uk-flex-center uk-flex-column uk-flex-middle">
    <div class="page-loader" v-if="loading">
      <div uk-spinner></div>
      <p>Loading Drafts</p>
    </div>
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m" v-if="!loading">
      <h4 style="color: #bdc3c7;margin: 0;" v-if="!drafts">You haven't written any drafts, yet.</h4>
      <div v-for="(draft, slug) in drafts" :key="slug" :data-slug="slug">
        <!-- This will be reused in a component, ik it's stupid rn. If anyone wants to do it for me i love you ty -->
        <nuxt-link :to="'/edit/'+slug+'/'" class="nuxt-link">
          <div class="post">
            <div class="top-post">
              <div class="post-title">
                <h1 :data-slug="slug">{{ draft.title }}</h1>
                <div class="badge" style="margin-left: 10px;">draft</div>
              </div>
              <div class="post-actions">
                <span
                  uk-icon="icon: pencil"
                  class="post-actions-icon"
                  uk-tooltip="Edit Draft"
                  @click.prevent="sendToUpdate(slug)"
                ></span>
                <span
                  uk-icon="icon: trash"
                  class="post-actions-icon"
                  uk-tooltip="Delete Draft"
                  @click.prevent="deletePost(slug, 'drafts.json')"
                ></span>
              </div>
            </div>
            <p>{{ draft.content }}</p>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      drafts: {}
    };
  },
  mounted() {
    this.$requireSignIn(this.$router);
    if (UIkit) {
      UIkit.offcanvas("#offcanvas-nav").hide();
    }
    this.$getFileContents("drafts.json", false, true)
      .then(drafts => {
        if (typeof drafts == "string") {
          drafts = JSON.parse(drafts);
        }
        if (drafts && Object.keys(drafts).length > 0) {
          this.drafts = this.$sortPostsByDate(drafts);
        } else {
          this.drafts = false;
        }
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
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
          this.$deletePost(slug, "drafts.json", true)
            .then(res => {
              if (res.posts) {
                if (typeof res.posts == "string") {
                  res.posts = JSON.parse(res.posts);
                }
                this.drafts = res.posts;
                if (Object.keys(this.drafts).length == 0) {
                  this.drafts = false;
                }
                this.$sound("ok.wav");
                this.$toast("Deleted draft successfully");
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