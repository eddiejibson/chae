<template>
  <Post edit/>
</template>
<script>
import Post from "../post.vue";
export default {
  components: {
    Post: Post
  },
  head() {
    return {
      title: "edit || chae."
    };
  }
};
</script>