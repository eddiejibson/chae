<template>
  <div class="uk-flex uk-flex-center uk-flex-column uk-flex-middle">
    <div class="uk-inline uk-width-1-2@m">
      <span class="uk-form-icon" uk-icon="icon: search"></span>
      <input
        class="uk-input search-form"
        @input.prevent="searchFor($event)"
        :value="search"
        type="text"
      >
    </div>
    <div class="search-results uk-width-1-2@m">
      <div v-if="!result && search && !loading">
        <h4 style="color: #bdc3c7;margin: 0;text-align:center;">No Results</h4>
      </div>
      <div v-if="loading">
        <div class="page-loader" v-if="loading">
          <div uk-spinner></div>
          <p>Loading Results</p>
        </div>
      </div>
      <nuxt-link :to="handle" class="nuxt-link" v-if="result">
        <div class="search-post post">
          <div class="uk-flex uk-flex-row">
            <img class="search-profile-picture" :src="propic">
            <div class="search-info profile-info">
              <div class="uk-flex align-center uk-flex-between">
                <h3 class="search-title">{{ user }}</h3>
                <p class="post-count">{{postCount}} post{{s}}</p>
              </div>
              <p class="small-margin bio">{{ bio }}</p>
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: null,
      timeout: null,
      result: false,
      profile: null,
      user: null,
      propic: "https://cdn.chae.sh/img/icons/icon.png",
      postCount: 0,
      noResults: false,
      loading: false,
      handle: "/search",
      s: "s",
      bio: null
    };
  },
  methods: {
    searchFor(e) {
      this.loading = true;
      this.result = false;
      this.search = e.target.value;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.$search(e.target.value)
          .then(profile => {
            if (profile) {
              this.loading = false;
              this.user = profile.name;
              this.handle = profile.handle;
              this.result = true;
              this.propic = profile.image[0].contentUrl;
              this.$getFileContents("posts.json", profile.handle)
                .then(posts => {
                  if (posts) {
                    this.postCount = this.$getPostCount(posts);
                    if (this.postCount == 1) {
                      this.s = "";
                    } else {
                      this.s = "s";
                    }
                  }
                })
                .catch(err => {
                  console.error(err);
                });
              this.$getFileContents("options.json", profile.handle)
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
            } else {
              this.loading = false;
              this.result = false;
            }
          })
          .catch(err => {
            this.loading = false;
            this.result = false;
            console.error(err);
          });
      }, 600);
    }
  },
  mounted() {
    if (UIkit) {
      UIkit.offcanvas("#offcanvas-nav").hide();
    }
  },
  head() {
    return {
      title: "search || chae."
    };
  }
};
</script>