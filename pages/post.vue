<template>
  <div class="uk-flex uk-flex-center">
    <div class="uk-width-1-2@m uk-margin">
      <input class="uk-input margin-bottom" type="text" placeholder="Title">
      <textarea
        class="uk-textarea"
        id="post-content"
        rows="5"
        placeholder="Write something spicy here"
        @input="testThing($event)"
      ></textarea>
    </div>
  </div>
</template>
<script>
import * as blockstack from "blockstack";
export default {
  mounted() {
    this.$requireSignIn(this.$router);
    UIkit.offcanvas("#offcanvas-nav").hide();
  }
};
</script>